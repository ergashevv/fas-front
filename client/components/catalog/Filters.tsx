import { useFilters } from "@/store/useFilters";
import { AGE_RANGES, GENDERS, COLORS, SEASONS } from "@/lib/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

export const Filters = () => {
  const {
    gender,
    setGender,
    ageRange,
    setAgeRange,
    colors,
    setColors,
    priceRange,
    setPriceRange,
    sort,
    setSort,
  } = useFilters();

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        defaultValue="gender"
        className="w-full"
      >
        <AccordionItem value="gender">
          <AccordionTrigger>Jinsi</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {GENDERS.map((g) => (
                <div key={g.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`gender-${g.value}`}
                    checked={gender.includes(g.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setGender([...gender, g.value]);
                      } else {
                        setGender(gender.filter((x) => x !== g.value));
                      }
                    }}
                  />
                  <label
                    htmlFor={`gender-${g.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {g.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age">
          <AccordionTrigger>Yosh oralig'i</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {AGE_RANGES.map((age) => (
                <div key={age.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`age-${age.value}`}
                    checked={ageRange.includes(age.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAgeRange([...ageRange, age.value]);
                      } else {
                        setAgeRange(ageRange.filter((x) => x !== age.value));
                      }
                    }}
                  />
                  <label
                    htmlFor={`age-${age.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {age.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Ranglar</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(COLORS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    if (colors.includes(key)) {
                      setColors(colors.filter((x) => x !== key));
                    } else {
                      setColors([...colors, key]);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    colors.includes(key)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Narx</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">
                  Minimal: {priceRange[0].toLocaleString()} so'm
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">
                  Maksimal: {priceRange[1].toLocaleString()} so'm
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger>Saralash</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                { value: "newest", label: "Eng yangi" },
                { value: "price-asc", label: "Narx: past → yuqori" },
                { value: "price-desc", label: "Narx: yuqori → past" },
                { value: "rating", label: "Reyting" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`sort-${option.value}`}
                    name="sort"
                    value={option.value}
                    checked={sort === option.value}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor={`sort-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
