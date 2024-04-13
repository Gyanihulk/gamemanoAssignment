"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [director, setDirector] = useState("");
  const [actors, setActors] = useState("");


  const debouncedTitle = useDebounce(title);
  const debouncedGenre = useDebounce(genre);
  const debouncedLanguage = useDebounce(language);
  const debouncedDirector = useDebounce(director);
  const debouncedActors = useDebounce(actors);


  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedTitle,
          genreName: debouncedGenre,
          language: debouncedLanguage,
          director: debouncedDirector,
          actors: debouncedActors.split(',').map((actor) => actor.trim()), 
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [
    debouncedTitle,
    debouncedGenre,
    debouncedLanguage,
    debouncedDirector,
    debouncedActors,
    router,
    pathname,
  ]);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      {/* Title input */}
      <InputWithSearchIcon
        value={title}
        onChange={setTitle}
        placeholder="Title"
      />

      {/* Genre input */}
      <InputWithSearchIcon
        value={genre}
        onChange={setGenre}
        placeholder="Genre"
      />

      {/* Language input */}
      <InputWithSearchIcon
        value={language}
        onChange={setLanguage}
        placeholder="Language"
      />

      {/* Director input */}
      <InputWithSearchIcon
        value={director}
        onChange={setDirector}
        placeholder="Director"
      />

      {/* Actors input */}
      <InputWithSearchIcon
        value={actors}
        onChange={setActors}
        placeholder="Actor"
      />
    </div>
  );
};
interface InputWithSearchIconProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string; // Optional prop with a default value of "text"
}
const InputWithSearchIcon: React.FC<InputWithSearchIconProps> = ({
  value,
  onChange,
  placeholder,
  type = "text", // Default value for the optional prop
}) => (
  <div className="relative">
    <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
    <Input
      type={type}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className="w-full md:w-[150px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
      placeholder={placeholder}
    />
  </div>
);
