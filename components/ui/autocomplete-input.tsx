import { useEffect, useState } from "react";

import { COUNTRIES } from "@lib/data/countries";
import { G_LEAGUE_TEAMS } from "@lib/data/g-league";
import { Input } from "./input";
import { NCAA_DIV_1_SCHOOLS } from "@lib/data/ncaa-schools";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="relative w-full z-10">
      <Input
        type="text"
        className="flex w-full border border-gray-300 p-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onFocus={() => inputValue && setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul className="absolute border border-gray-300 bg-white w-full max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setInputValue(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoCompleteInput;
