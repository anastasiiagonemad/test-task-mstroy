<script setup lang="ts">
import { computed } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  type ColDef
} from 'ag-grid-community';
import { RowGroupingModule } from 'ag-grid-enterprise';
import type { DemoItem } from '../data/items';
import { TreeStore } from '../lib/TreeStore';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

interface GridRow extends DemoItem {
  category: 'Группа' | 'Элемент';
  path: string[];
}

const props = defineProps<{
  items: DemoItem[];
}>();

const store = computed(() => new TreeStore(props.items));

const rowData = computed<GridRow[]>(() =>
  store.value.getAll().map((item) => {
    const path = store.value
      .getAllParents(item.id)
      .reverse()
      .map((parentItem) => String(parentItem.id));

    return {
      ...item,
      category: store.value.getChildren(item.id).length > 0 ? 'Группа' : 'Элемент',
      path
    };
  })
);

const columnDefs: ColDef<GridRow>[] = [
  {
    headerName: '№ п/п',
    maxWidth: 110,
    sortable: false,
    valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1.4
  },
  {
    headerName: 'Категория',
    field: 'category',
    minWidth: 150
  },
  {
    headerName: 'ID',
    field: 'id',
    minWidth: 140
  },
  {
    headerName: 'Parent ID',
    valueGetter: (params) => params.data?.parent ?? 'root',
    minWidth: 140
  }
];

const autoGroupColumnDef: ColDef = {
  headerName: 'Структура',
  minWidth: 280,
  cellRendererParams: {
    suppressCount: true
  },
  valueGetter: (params) => params.data?.label
};
</script>

<template>
  <div class="tree-grid ag-theme-quartz">
    <AgGridVue
      :row-data="rowData"
      :column-defs="columnDefs"
      :tree-data="true"
      :animate-rows="true"
      :group-default-expanded="-1"
      :auto-group-column-def="autoGroupColumnDef"
      :get-data-path="(data: GridRow) => data.path"
      :row-selection="{ mode: 'singleRow' }"
      dom-layout="autoHeight"
    />
  </div>
</template>
