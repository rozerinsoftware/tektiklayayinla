import { useState, useCallback } from 'react';
import { getTumIlanlar } from '../api';
import { ilanKategoriEslesir } from '../constants/kategoriler';

export function useIlanSayimlari() {
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const yukle = useCallback(async () => {
    try {
      setYukleniyor(true);
      const data = await getTumIlanlar();
      setIlanlar(data);
      return data;
    } catch {
      setIlanlar([]);
      return [];
    } finally {
      setYukleniyor(false);
    }
  }, []);

  const say = useCallback(
    (kategoriId, filtreYolu = null) => {
      if (!kategoriId && !filtreYolu?.length) return ilanlar.length;
      const id = filtreYolu?.length ? filtreYolu[filtreYolu.length - 1] : kategoriId;
      return ilanlar.filter((i) => ilanKategoriEslesir(i, id, filtreYolu)).length;
    },
    [ilanlar]
  );

  const cocukSayimlari = useCallback(
    (cocuklar = [], ustYolIds = []) => {
      const map = {};
      cocuklar.forEach((c) => {
        const yol = [...ustYolIds, c.id];
        map[c.id] = say(c.id, yol);
      });
      return map;
    },
    [say]
  );

  return { ilanlar, yukleniyor, yukle, say, cocukSayimlari };
}
