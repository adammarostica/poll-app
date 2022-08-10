import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import firebase from "../firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function useVerifiedValue(debouncedInput) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);
  const [verifiedValue, setVerifiedValue] = useState("");

  // Replace non-alphanumeric characters of debouncedInput to dashes, then compare to values at Firebase address.
  // If value already exists, adds random numbers to end of value.
  // Note: A value with these random numbers is not verified. 
  useEffect(() => {
    try {
      // If able to compare to the database, create a value based on what is returned
      if (debouncedInput) {
        setVerifiedValue("loading");
        const valueKebab = debouncedInput
          .match(/[A-Za-z0-9]+/gi)
          .join("-")
          .slice(0, 24);
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/${valueKebab}`);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            setValue(valueKebab.slice(0, 21) + Math.floor(Math.random() * 1000));
            setVerifiedValue(
              valueKebab.slice(0, 21) + Math.floor(Math.random() * 1000)
            );
          } else {
            setValue(valueKebab);
            setVerifiedValue(valueKebab);
          }
        });
      } else {
        // Unverified values cannot be used. Defaulting to empty strings. 
        setValue("");
        setVerifiedValue("");
      }
    } catch {
      // Unverified values cannot be used. Defaulting to empty strings.
      setValue("");
      setVerifiedValue("");
    }
  }, [debouncedInput]);

  useEffect(() => {
    if (debouncedValue === "") {
      setVerifiedValue("");
    } else if (!debouncedValue.match(/^[A-Za-z0-9-]+$/)) {
      setVerifiedValue("invalid slug");
      return;
    } else if (debouncedValue !== "") {
      const database = getDatabase(firebase);
      const dbRef = ref(database, `/${debouncedValue}`);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          setVerifiedValue("already used");
        } else {
          setVerifiedValue(debouncedValue);
        }
      });
    }
  }, [debouncedValue]);

  return [value, setValue, verifiedValue];
}
