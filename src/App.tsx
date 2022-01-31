import { useEffect, useMemo, useState } from 'react';
import { useObservableState } from 'observable-hooks';
import { BehaviorSubject, combineLatestWith, map } from "rxjs";
import { PokemonProvider, usePokemon } from './store';

import './App.css'

const Search = () => {
  const { pokemon$, selectedPokemon$ } = usePokemon();
  const search$ = useMemo(() => new BehaviorSubject(""), []);
  const pokemon = useObservableState(pokemon$, [])

  const [filteredPokemon] = useObservableState(
    () =>
      pokemon$.pipe(
        combineLatestWith(search$),
        map(([pokemon, search]) =>
          pokemon.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      ),
    []
  );

  return (
    <div>
      <input
        type="text"
        value={search$.value}
        onChange={(e) => search$.next(e.target.value)}
      />
      <div>
        {filteredPokemon.map(p => (
          <div key={p.id}>
            <input type='checkbox'
              checked={p.selected}
              onChange={() => {
                if (selectedPokemon$.value.includes(p.id)) {
                  selectedPokemon$.next(selectedPokemon$.value.filter(id => id !== p.id))
                } else {
                  selectedPokemon$.next([...selectedPokemon$.value, p.id])
                }
              }}
            />
            <strong>{p.name}</strong> - {p.power}
          </div>
        ))}
      </div>
    </div>
  )
}

const Deck = () => {
  const { deck$ } = usePokemon();
  const deck = useObservableState(deck$, []);

  return (
    <div>
      <h4>Deck</h4>
      <div>
        {deck.map((p) => (
          <div key={p.id} style={{ display: "flex" }}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
            />
            <div>
              <div>{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {

  return (
    <PokemonProvider>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Search />
        <Deck />
      </div>
    </PokemonProvider>
  )
}

export default App
