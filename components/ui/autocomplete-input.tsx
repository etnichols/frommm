import { useEffect, useState } from "react";

import { COUNTRIES } from "@lib/data/countries";
import { G_LEAGUE_TEAMS } from "@lib/data/g-league";
import { NCAA_DIV_1_SCHOOLS } from "@lib/data/ncaa-schools";
import Input from "../Input";

function AutoCompleteInput({
  inputValue,
  setInputValue,
  optionSet = NCAA_DIV_1_SCHOOLS.concat(G_LEAGUE_TEAMS).concat(COUNTRIES),
}: {
  inputValue: string;
  setInputValue: (value: string) => void;
  optionSet?: string[];
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (inputValue) {
      const filteredOptions = optionSet.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredOptions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  return (
    <div className="relative w-full bg-white">
      <Input
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        autoComplete="off"
        value={inputValue}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onFocus={() => inputValue && setShowSuggestions(true)}
      />
      {showSuggestions && (
        <div className="absolute z-50 bg-white border border-gray-900 border-2 w-full max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setInputValue(suggestion);
                  setShowSuggestions(false);
                }
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setInputValue(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutoCompleteInput;
