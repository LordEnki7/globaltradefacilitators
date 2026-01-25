import { useState } from "react";
import { 
  Globe, 
  Search, 
  Building2,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { USDA_APPROVED_COUNTRIES } from "@shared/schema";

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = USDA_APPROVED_COUNTRIES.filter(country => {
    const matchesSearch = 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.approvedBanks.some(bank => bank.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const regionGroups = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, typeof USDA_APPROVED_COUNTRIES>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Approved Countries</h1>
        <p className="text-muted-foreground text-sm mt-1">
          USDA GSM-102 approved importing countries and their authorized banks
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by country, region, or bank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-countries"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{USDA_APPROVED_COUNTRIES.length}</p>
                <p className="text-xs text-muted-foreground">Approved Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(regionGroups).length}</p>
                <p className="text-xs text-muted-foreground">Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {USDA_APPROVED_COUNTRIES.reduce((sum, c) => sum + c.approvedBanks.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Approved Banks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.entries(regionGroups).map(([region, countries]) => (
        <div key={region} className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{region}</h2>
            <Badge variant="secondary" className="text-xs">
              {countries.length} {countries.length === 1 ? "country" : "countries"}
            </Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <Card 
                key={country.code} 
                className="hover-elevate cursor-default"
                data-testid={`country-card-${country.code}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{country.code}</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">{country.name}</CardTitle>
                        <CardDescription className="text-xs">{country.region}</CardDescription>
                      </div>
                    </div>
                    {country.isActive && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">Approved Banks:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {country.approvedBanks.map((bank) => (
                      <Badge 
                        key={bank} 
                        variant="secondary" 
                        className="text-xs font-normal"
                      >
                        {bank}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filteredCountries.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No countries found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
