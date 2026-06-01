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
    (kategoriId) => {
      if (!kategoriId) return ilanlar.length;
      return ilanlar.filter((i) => ilanKategoriEslesir(i, kategoriId)).length;
    },
    [ilanlar]
  );

  const cocukSayimlari = useCallback(
    (cocuklar = []) => {
      const map = {};
      cocuklar.forEach((c) => {
        map[c.id] = say(c.id);
      });
      return map;
    },
    [say]
  );

  return { ilanlar, yukleniyor, yukle, say, cocukSayimlari };
}
