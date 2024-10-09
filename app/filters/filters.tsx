"use client";

import { useMachine } from "@xstate/react";

import { fetchMachine } from "./machine.filters";
import { filters } from "./getFilters";
import { Button } from "../components/shared/button/Button";

export function Filters({}) {
  const [state, send] = useMachine(fetchMachine);
  const {
    context: { currentFilters, data }
  } = state;

  const filterCategories = Object.keys(filters);
  const buttonFilters = data ?? currentFilters;

  return (
    <div className="mx-11 grid grid-cols-4">
      {filterCategories &&
        filterCategories.map((key) => (
          <div key={key}>
            <h3 className="font-extrabold mt-4">{key}</h3>
            <ul>
              {buttonFilters &&
                (buttonFilters[key as keyof typeof filters] as string[]).map(
                  (value, i) => (
                    <li key={i}>
                      <Button
                        className="mt-4"
                        onClick={() =>
                          send({
                            type: "SEARCH",
                            value: { ...filters, [key]: [value] }
                          })
                        }
                      >
                        {value}
                      </Button>
                    </li>
                  )
                )}
            </ul>
          </div>
        ))}
      <div className="mt-10">
        <Button
          variant={"icon"}
          className="p-10"
          onClick={() => send({ type: "RESET" })}
        >
          RESET
        </Button>
      </div>
      <div className="mt-10">
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
}
