export type TreeId = string | number;

export interface TreeNode {
  id: TreeId;
  parent: TreeId | null;
  [key: string]: unknown;
}

export class TreeStore<TItem extends TreeNode> {
  private items: TItem[];
  private itemById = new Map<TreeId, TItem>();
  private indexById = new Map<TreeId, number>();
  private childrenByParent = new Map<TreeId | null, Set<TreeId>>();

  constructor(items: TItem[]) {
    this.items = [...items];
    this.rebuildIndexes();
  }

  getAll(): TItem[] {
    return this.items;
  }

  getItem(id: TreeId): TItem | undefined {
    return this.itemById.get(id);
  }

  getChildren(id: TreeId): TItem[] {
    const childIds = this.childrenByParent.get(id);
    if (!childIds || childIds.size === 0) {
      return [];
    }

    const children: TItem[] = [];
    for (const childId of childIds) {
      const child = this.itemById.get(childId);
      if (child) {
        children.push(child);
      }
    }

    return children;
  }

  getAllChildren(id: TreeId): TItem[] {
    const descendants: TItem[] = [];
    const stack = [...(this.childrenByParent.get(id) ?? [])];

    while (stack.length > 0) {
      const childId = stack.pop() as TreeId;
      const child = this.itemById.get(childId);

      if (!child) {
        continue;
      }

      descendants.push(child);

      const nestedChildren = this.childrenByParent.get(childId);
      if (nestedChildren && nestedChildren.size > 0) {
        stack.push(...nestedChildren);
      }
    }

    return descendants;
  }

  getAllParents(id: TreeId): TItem[] {
    const parents: TItem[] = [];
    let current = this.itemById.get(id);

    while (current) {
      parents.push(current);

      if (current.parent === null) {
        break;
      }

      current = this.itemById.get(current.parent);
    }

    return parents;
  }

  addItem(item: TItem): void {
    if (this.itemById.has(item.id)) {
      throw new Error(`Item with id "${String(item.id)}" already exists.`);
    }

    this.items.push(item);
    this.itemById.set(item.id, item);
    this.indexById.set(item.id, this.items.length - 1);
    this.addChildLink(item.parent, item.id);
  }

  removeItem(id: TreeId): void {
    if (!this.itemById.has(id)) {
      return;
    }

    const idsToRemove = new Set<TreeId>([id]);
    const stack = [id];

    while (stack.length > 0) {
      const currentId = stack.pop() as TreeId;
      const childIds = this.childrenByParent.get(currentId);

      if (!childIds) {
        continue;
      }

      for (const childId of childIds) {
        if (!idsToRemove.has(childId)) {
          idsToRemove.add(childId);
          stack.push(childId);
        }
      }
    }

    for (const removableId of idsToRemove) {
      const item = this.itemById.get(removableId);
      if (!item) {
        continue;
      }

      this.removeChildLink(item.parent, removableId);
      this.childrenByParent.delete(removableId);
      this.itemById.delete(removableId);
      this.indexById.delete(removableId);
    }

    this.items = this.items.filter((item) => !idsToRemove.has(item.id));

    for (let index = 0; index < this.items.length; index += 1) {
      this.indexById.set(this.items[index].id, index);
    }
  }

  updateItem(item: TItem): void {
    const currentItem = this.itemById.get(item.id);
    if (!currentItem) {
      throw new Error(`Item with id "${String(item.id)}" does not exist.`);
    }

    const index = this.indexById.get(item.id);
    if (index === undefined) {
      throw new Error(`Index for item "${String(item.id)}" is missing.`);
    }

    if (currentItem.parent !== item.parent) {
      this.removeChildLink(currentItem.parent, item.id);
      this.addChildLink(item.parent, item.id);
    }

    this.items[index] = item;
    this.itemById.set(item.id, item);
  }

  private rebuildIndexes(): void {
    this.itemById.clear();
    this.indexById.clear();
    this.childrenByParent.clear();

    for (let index = 0; index < this.items.length; index += 1) {
      const item = this.items[index];

      if (this.itemById.has(item.id)) {
        throw new Error(`Duplicate item id "${String(item.id)}" detected.`);
      }

      this.itemById.set(item.id, item);
      this.indexById.set(item.id, index);
      this.addChildLink(item.parent, item.id);
    }
  }

  private addChildLink(parentId: TreeId | null, childId: TreeId): void {
    const children = this.childrenByParent.get(parentId);
    if (children) {
      children.add(childId);
      return;
    }

    this.childrenByParent.set(parentId, new Set([childId]));
  }

  private removeChildLink(parentId: TreeId | null, childId: TreeId): void {
    const children = this.childrenByParent.get(parentId);
    if (!children) {
      return;
    }

    children.delete(childId);

    if (children.size === 0) {
      this.childrenByParent.delete(parentId);
    }
  }
}
