import { describe, expect, it } from 'vitest';
import { demoItems } from '../data/items';
import { TreeStore } from './TreeStore';

describe('TreeStore', () => {
  it('returns the original list and allows quick item access', () => {
    const store = new TreeStore(demoItems);

    expect(store.getAll()).toHaveLength(8);
    expect(store.getItem('91064cee')).toMatchObject({ label: 'Айтем 2' });
    expect(store.getItem(999)).toBeUndefined();
  });

  it('returns direct children only', () => {
    const store = new TreeStore(demoItems);

    expect(store.getChildren(1).map((item) => item.id)).toEqual(['91064cee', 3]);
    expect(store.getChildren(3)).toEqual([]);
  });

  it('returns all descendants from any depth', () => {
    const store = new TreeStore(demoItems);

    expect(store.getAllChildren('91064cee').map((item) => item.id)).toEqual([6, 5, 4, 8, 7]);
  });

  it('returns the parent chain starting from the item itself', () => {
    const store = new TreeStore(demoItems);

    expect(store.getAllParents(8).map((item) => item.id)).toEqual([8, 4, '91064cee', 1]);
  });

  it('adds and updates items while preserving indexes', () => {
    const store = new TreeStore(demoItems);

    store.addItem({ id: 'new-child', parent: 3, label: 'Новый айтем' });
    expect(store.getChildren(3)).toMatchObject([{ id: 'new-child' }]);

    store.updateItem({ id: 'new-child', parent: 1, label: 'Перенесенный айтем' });
    expect(store.getChildren(3)).toEqual([]);
    expect(store.getChildren(1).map((item) => item.id)).toEqual(['91064cee', 3, 'new-child']);
    expect(store.getItem('new-child')).toMatchObject({ label: 'Перенесенный айтем' });
  });

  it('removes an item together with all descendants', () => {
    const store = new TreeStore(demoItems);

    store.removeItem('91064cee');

    expect(store.getItem('91064cee')).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
    expect(store.getItem(7)).toBeUndefined();
    expect(store.getAll().map((item) => item.id)).toEqual([1, 3]);
  });
});
