import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeliveryInfo } from "@shared/api";
import { deliveryApi } from "@/lib/adminApi";
import { MapPin, Clock, Truck } from "lucide-react";
import { toast } from "sonner";

interface LocationPickerProps {
  onLocationSelect: (delivery: DeliveryInfo) => void;
  selectedAddress?: any;
}

export const LocationPicker = ({ onLocationSelect, selectedAddress }: LocationPickerProps) => {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [instructions, setInstructions] = useState("");

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation sizning brauzeringizda qo'llab-quvvatlanmaydi");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        try {
          const delivery = await deliveryApi.calculate({
            latitude,
            longitude,
            address: selectedAddress
          });
          
          setDeliveryInfo(delivery);
          toast.success("Joylashuv muvaffaqiyatli aniqlandi!");
        } catch (error) {
          console.error("Error calculating delivery:", error);
          toast.error("Yetkazib berish haqida ma'lumot olishda xatolik");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Joylashuvni aniqlab bo'lmadi. Iltimos, qaytadan urinib ko'ring.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleConfirmLocation = () => {
    if (deliveryInfo && coordinates) {
      const finalDelivery: DeliveryInfo = {
        ...deliveryInfo,
        coordinates: {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        },
        instructions
      };
      
      onLocationSelect(finalDelivery);
    }
  };

  // Mock manual location entry (in real app, integrate with Yandex Maps)
  const handleManualLocation = async () => {
    if (!selectedAddress?.city || !selectedAddress?.street) {
      toast.error("Iltimos, to'liq manzilni kiriting");
      return;
    }

    setLoading(true);
    
    try {
      // Mock coordinates for Tashkent center
      const mockCoordinates = {
        latitude: 41.2995 + (Math.random() - 0.5) * 0.1,
        longitude: 69.2401 + (Math.random() - 0.5) * 0.1
      };
      
      const delivery = await deliveryApi.calculate({
        ...mockCoordinates,
        address: selectedAddress
      });
      
      setCoordinates({ lat: mockCoordinates.latitude, lng: mockCoordinates.longitude });
      setDeliveryInfo(delivery);
      toast.success("Yetkazib berish ma'lumotlari hisoblandi!");
    } catch (error) {
      console.error("Error calculating delivery:", error);
      toast.error("Yetkazib berish haqida ma'lumot olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Yetkazib berish joylashuvi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!deliveryInfo ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={getCurrentLocation}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {loading ? "Aniqlanmoqda..." : "Joriy joylashuvni aniqlash"}
              </Button>
              
              <Button
                onClick={handleManualLocation}
                disabled={loading || !selectedAddress}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Manzil bo'yicha hisoblash
              </Button>
            </div>
            
            {!selectedAddress && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Avval yetkazib berish manzilini to'ldiring
              </p>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-green-800">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Joylashuv tasdiqlandi</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Masofa</p>
                    <p className="text-gray-600">{deliveryInfo.distance} km</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium">Vaqt</p>
                    <p className="text-gray-600">{deliveryInfo.estimatedTime} daqiqa</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-600 rounded-full text-white text-xs flex items-center justify-center">₩</span>
                  <div>
                    <p className="font-medium">Narx</p>
                    <p className="text-gray-600">{deliveryInfo.deliveryCost?.toLocaleString()} so'm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="instructions">Kuryer uchun qo'shimcha ma'lumot (ixtiyoriy)</Label>
              <Textarea
                id="instructions"
                placeholder="Masalan: 5-qavat, 12-xonadon, qo'ng'iroqni ikki marta bosing..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleConfirmLocation}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Joylashuvni tasdiqlash
              </Button>
              
              <Button
                onClick={() => {
                  setDeliveryInfo(null);
                  setCoordinates(null);
                  setInstructions("");
                }}
                variant="outline"
              >
                Qaytadan
              </Button>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Hisoblash...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};