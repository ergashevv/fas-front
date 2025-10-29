import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  SortAsc, 
  SortDesc,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T, value: any) => React.ReactNode;
  width?: string;
}

interface DataTableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  filters?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  actions = [],
  title,
  searchable = true,
  searchPlaceholder = "Qidirish...",
  pagination,
  onSort,
  loading = false,
  emptyMessage = "Ma'lumotlar topilmadi",
  onSearch,
  searchValue = "",
  filters,
  headerActions
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortKey === key && sortDirection === 'asc') {
      direction = 'desc';
    }
    
    setSortKey(key);
    setSortDirection(direction);
    
    if (onSort) {
      onSort(key, direction);
    }
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const getValue = (item: T, key: string) => {
    return key.split('.').reduce((obj, k) => obj?.[k], item as any);
  };

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Local sorting if no external sort handler
    if (!onSort && sortKey) {
      result.sort((a, b) => {
        const aValue = getValue(a, sortKey);
        const bValue = getValue(b, sortKey);
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Local search if no external search handler
    if (!onSearch && localSearchValue) {
      result = result.filter(item =>
        columns.some(column => {
          const value = getValue(item, column.key as string);
          return String(value).toLowerCase().includes(localSearchValue.toLowerCase());
        })
      );
    }

    return result;
  }, [data, sortKey, sortDirection, localSearchValue, onSort, onSearch, columns]);

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  return (
    <Card>
      {(title || searchable || filters || headerActions) && (
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={localSearchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              )}
              
              {filters && <div className="flex gap-2">{filters}</div>}
              
              {headerActions && <div className="flex gap-2">{headerActions}</div>}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.key as string} 
                    style={{ width: column.width }}
                    className={column.sortable ? "cursor-pointer select-none" : ""}
                    onClick={() => column.sortable && handleSort(column.key as string)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && (
                        <div className="ml-1">
                          {sortKey === column.key ? (
                            sortDirection === 'asc' ? (
                              <SortAsc className="h-3 w-3" />
                            ) : (
                              <SortDesc className="h-3 w-3" />
                            )
                          ) : (
                            <div className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="text-center" style={{ width: "80px" }}>
                    Harakatlar
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : sortedAndFilteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => {
                      const value = getValue(item, column.key as string);
                      return (
                        <TableCell key={column.key as string}>
                          {column.render ? column.render(item, value) : String(value || '-')}
                        </TableCell>
                      );
                    })}
                    
                    {actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions
                              .filter(action => !action.show || action.show(item))
                              .map((action, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() => action.onClick(item)}
                                  className={action.variant === "destructive" ? "text-destructive" : ""}
                                >
                                  {action.icon && <span className="mr-2">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              ))
                            }
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Jami {pagination.total} ta natija, 
              {pagination.limit * (pagination.page - 1) + 1} - {Math.min(pagination.limit * pagination.page, pagination.total)} ko'rsatilmoqda
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Sahifada:</span>
                <Select
                  value={String(pagination.limit)}
                  onValueChange={(value) => pagination.onLimitChange(Number(value))}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-sm text-muted-foreground px-2">
                  {pagination.page} / {totalPages}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}