import { assign, fromPromise, setup } from "xstate";

import getFilters, { filters, TFilters } from "./getFilters";

export const fetchMachine = setup({
  types: {
    context: {} as {
      data: TFilters | null;
      currentFilters: TFilters | null;
    },
    events: {} as
      | {
          type: "SEARCH";
          value: TFilters;
        }
      | {
          type: "RESET";
        }
  },
  actors: {
    fetchFilters: fromPromise(({ input }: { input: TFilters }) =>
      getFilters(input)
    )
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFEBBAJQGEAJAbQAYBdRUAAcA9rFwAXXMPwCQAD0QBGACwAOEgDZuigKwB2VYr3buAJmV6ANCACeSvcpIBOHQGYVb18qd6nT1QC+AdZoWHiEpORU1Mz0DAAqPPxIICJiktKyCggAtMo6JK6m5nqm3F7eqla2iHmuzhqlrjrKaq56itrKQSEYOATEJABmuBTiYABOBFDUENJgZPgAbsIA1guh-RHDo+NT+FAIBCuY6Bn4SUmyaRJSMinZZfU6Gqo63KVaLk3WdrmuGhIqmaqicui0ymKKh6IE24UGIzGk2m1EmE2EExIggoZyGGNQJDhA1IiL20yOy2Ep3Olz411Et0yD0QnhIplB3DBpn05Wav0QZUUzlMPkhimKrncilcMKJ2yG6FGAFcJjQ5LBxGcFughntkJ1uNwiNQ5QjFRQVWArikbucsizQYVmk4NMpmuzXB9+QhdI5IT4Re9lIoNDpAjD8MIIHBZKaiPT0nd7bknPUiiUnq1-NU-jlpULlI1zCLpcVC+HemFiWRKGAE4z7qBsm4SDp3gZ-E41C8nKZvYonNxCoXlB9xbpXF29LK+vCSbtkQd63bmQginoSP6OkVe-4Xv2NEKdNKPse3mG291grDZ9WFcrVcuk6uOkODOLVG895L+y5hxpXDeYM3C-IIgiAA */
  initial: "idle",
  context: {
    data: null,
    currentFilters: filters
  },
  states: {
    idle: {
      on: {
        SEARCH: {
          actions: assign({ currentFilters: ({ event }) => event.value }),
          target: "filtering"
        },
        RESET: {
          actions: assign({ currentFilters: null, data: filters }),
          target: "idle"
        }
      }
    },
    filtering: {
      invoke: {
        src: "fetchFilters",
        input: ({
          context
        }: {
          context: { currentFilters: TFilters | null };
        }) => context.currentFilters ?? {},
        onDone: {
          target: "idle",
          actions: assign({
            data: ({ event }) => event.output.data
          })
        },
        onError: "failure"
      }
    },
    failure: {
      after: {
        1000: "filtering"
      }
    }
  }
});
