import { HashRouter } from 'react-router-dom';
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, HitsPerPage, useInstantSearch } from "react-instantsearch";
import CategoryFilter from './pages/search/components/CategoryFilter';
import PriceRange from './pages/search/components/PriceRange';
import BrandFilter from './pages/search/components/BrandFilter';
import Pagination from './pages/search/components/Pagination';
import type { Product } from './Catalog/types';

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);


function Hit({ hit }: { hit: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={hit.images_urls?.[0]}
          alt={hit.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {hit.categories?.[0] ?? "Sin categoría"}
        </p>
        <h1 className="line-clamp-2 text-sm font-semibold text-slate-800">
          {hit.title ?? "Sin título"}
        </h1>
        <p className="mt-auto pt-2 text-lg font-bold text-slate-900">
          {hit.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? "N/D"}
        </p>
      </div>
    </article>
  );
}


function NoResults() {
  const { indexUiState, results } = useInstantSearch();

  if (results.nbHits !== 0) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-base font-semibold text-slate-700">
        No se encontraron resultados
      </p>
      <p className="text-sm text-slate-500">
        {indexUiState.query
          ? <>No hay productos que coincidan con &quot;{indexUiState.query}&quot;.</>
          : "Intenta ajustar los filtros o la búsqueda."}
      </p>
    </div>
  );
}


function Results() {
  const { results } = useInstantSearch();

  if (results.nbHits === 0) {
    return <NoResults />;
  }

  return (
    <Hits
      hitComponent={Hit}
      classNames={{
        list: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
      }}
    />
  );
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50">

        <header className="bg-blue-800/90 py-6 shadow-md">
          <h1 className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
            BomboCars - Laboratorio 2
          </h1>
        </header>

        <InstantSearch searchClient={searchClient} indexName="laboratorio_2">
          <div className="mx-auto max-w-7xl px-4 py-6">

            <div className="mb-6">
              <SearchBox
                classNames={{
                  root: "w-full",
                  form: "relative",
                  input:
                    "w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                  submitIcon: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-slate-400",
                  resetIcon: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-slate-400",
                }}
              />
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">

              <aside className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:w-72 lg:shrink-0">
                <div>
                  <h2 className="mb-2 text-sm font-semibold text-slate-700">Categoría</h2>
                  <CategoryFilter />
                </div>
                <hr className="border-slate-200" />
                <div>
                  <h2 className="mb-2 text-sm font-semibold text-slate-700">Marca</h2>
                  <BrandFilter />
                </div>
                <hr className="border-slate-200" />
                <div>
                  <h2 className="mb-2 text-sm font-semibold text-slate-700">Precio</h2>
                  <PriceRange />
                </div>

              </aside>


              <main className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                  <span className="text-sm text-slate-500">Resultados</span>
                  <HitsPerPage
                    classNames={{
                      root: "container-option",
                      select:
                        "rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:border-indigo-500",
                    }}
                    items={[
                      { label: '16 por página', value: 16, default: true },
                      { label: '32 por página', value: 32 },
                      { label: '64 por página', value: 64 },
                    ]}
                  />
                </div>

                <Results />

                <div className="flex justify-center pt-4">
                  <Pagination />
                </div>
              </main>
            </div>
          </div>
        </InstantSearch>
      </div>
    </HashRouter>
  );
}

export default App;