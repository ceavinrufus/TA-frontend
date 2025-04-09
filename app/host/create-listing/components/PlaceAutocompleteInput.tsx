import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import MapdisplayComponentCreateListing from "./MapDisplayComponentCreateListing";
import { Input } from "@/components/ui/input";

export interface PlaceSuggestion {
  name: string;
  mapbox_id: string;
  feature_type: string;
  place_formatted: string;
}

interface PlaceAutoCompleteInputProps {
  value?: {
    value: string;
    coordinates: number[] | null;
  };
  onChange: (value: { value: string; coordinates: number[] | null }) => void;
}

export const PlaceAutoCompleteInput = ({
  value,
  onChange,
}: PlaceAutoCompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [options, setOptions] = useState<PlaceSuggestion[]>([]);
  const [queryString, setQueryString] = useState(value?.value || "");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [coordinates, setCoordinates] = useState<number[] | null>(
    value?.coordinates || null
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(queryString);
    }, 500);

    return () => clearTimeout(timer);
  }, [queryString]);

  useEffect(() => {
    if (debouncedValue.length > 0) {
      fetchSuggestions(debouncedValue);
    } else {
      setOpen(false);
    }
  }, [debouncedValue]);
  const handleSelection = (place: PlaceSuggestion) => {
    fetchPlaceById(`${place.name}, ${place.place_formatted}`, place.mapbox_id);
    setQueryString(`${place.name}, ${place.place_formatted}`);
  };

  const prefillWithLocationName = () => {
    onChange({
      value: queryString,
      coordinates: null,
    });
    setOptions([]);
    setOpen(false);
  };

  const fetchPlaceById = async (placeName: string, id: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&session_token=`
      );
      const data = await response.json();
      console.log({ placeData: data.features[0] });
      setCoordinates(data.features[0].geometry.coordinates);
      onChange({
        value: placeName,
        coordinates: data.features[0].geometry.coordinates,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  };

  const fetchSuggestions = async (queryString: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${queryString}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&session_token=`
      );
      const data = await response.json();
      setOptions(data.suggestions);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        className="md:p-4 md:h-[56px] md:rounded-2xl"
        placeholder="Enter your property's address"
        value={queryString}
        onChange={(e) => {
          setOpen(true);
          setIsFetchingSuggestions(true);
          setQueryString(e.target.value);
          onChange({
            value: e.target.value,
            coordinates: null,
          });
        }}
      />
      {open && (
        <div
          style={{ zIndex: "1000" }}
          className="absolute mt-1 p-1 w-full rounded-xl rounded-t-none border bg-white"
        >
          <ul>
            {isFetchingSuggestions ? (
              <li className="aria-selected:bg-accent aria-selected:text-accent-foreground bled]:pointer-events-none relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled='true']:opacity-50">
                Fetching Suggestions...
              </li>
            ) : (
              <>
                {options.map((place) => (
                  <li
                    onClick={() => handleSelection(place)}
                    key={place.mapbox_id}
                    className="aria-selected:bg-accent space-x-2 aria-selected:text-accent-foreground bled]:pointer-events-none relative flex cursor-pointer select-none items-center rounded-sm hover:bg-slate-100 px-2 py-1.5 text-sm outline-none data-[disabled='true']:opacity-50"
                  >
                    <span>
                      <MapPin className={"text-slate-500"} />
                    </span>
                    <span className={"text-slate-700"}>
                      {place.name}, {place.place_formatted}
                    </span>
                  </li>
                ))}
                <li
                  onClick={prefillWithLocationName}
                  key={"new"}
                  className="aria-selected:bg-accent space-x-2 aria-selected:text-accent-foreground bled]:pointer-events-none relative flex cursor-pointer select-none items-center rounded-sm hover:bg-slate-100 px-2 py-1.5 text-sm outline-none data-[disabled='true']:opacity-50"
                >
                  <span>
                    <MapPin className={"text-slate-500"} />
                  </span>
                  <span>
                    Use <strong>&quot;{queryString}&quot;</strong>
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
      <div className={"mt-4"}>
        <MapdisplayComponentCreateListing
          center={coordinates}
          isInteractive={false}
        />
      </div>
    </div>
  );
};
