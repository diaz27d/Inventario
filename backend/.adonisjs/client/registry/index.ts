/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'nombre_label_input_variables.exportar_label_input': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/NombreLabelInputVariables',
    tokens: [{"old":"/api/v1/NombreLabelInputVariables","type":0,"val":"api","end":""},{"old":"/api/v1/NombreLabelInputVariables","type":0,"val":"v1","end":""},{"old":"/api/v1/NombreLabelInputVariables","type":0,"val":"NombreLabelInputVariables","end":""}],
    types: placeholder as Registry['nombre_label_input_variables.exportar_label_input']['types'],
  },
  'productos.productos_existentes': {
    methods: ["POST"],
    pattern: '/api/v1/ProductosExistentes',
    tokens: [{"old":"/api/v1/ProductosExistentes","type":0,"val":"api","end":""},{"old":"/api/v1/ProductosExistentes","type":0,"val":"v1","end":""},{"old":"/api/v1/ProductosExistentes","type":0,"val":"ProductosExistentes","end":""}],
    types: placeholder as Registry['productos.productos_existentes']['types'],
  },
  'productos.guardar_producto': {
    methods: ["POST"],
    pattern: '/api/v1/GuardarProducto',
    tokens: [{"old":"/api/v1/GuardarProducto","type":0,"val":"api","end":""},{"old":"/api/v1/GuardarProducto","type":0,"val":"v1","end":""},{"old":"/api/v1/GuardarProducto","type":0,"val":"GuardarProducto","end":""}],
    types: placeholder as Registry['productos.guardar_producto']['types'],
  },
  'productos.actualizar_producto': {
    methods: ["PUT"],
    pattern: '/api/v1/ActualizarProducto',
    tokens: [{"old":"/api/v1/ActualizarProducto","type":0,"val":"api","end":""},{"old":"/api/v1/ActualizarProducto","type":0,"val":"v1","end":""},{"old":"/api/v1/ActualizarProducto","type":0,"val":"ActualizarProducto","end":""}],
    types: placeholder as Registry['productos.actualizar_producto']['types'],
  },
  'productos.productos_combos': {
    methods: ["POST"],
    pattern: '/api/v1/ProductosCombos',
    tokens: [{"old":"/api/v1/ProductosCombos","type":0,"val":"api","end":""},{"old":"/api/v1/ProductosCombos","type":0,"val":"v1","end":""},{"old":"/api/v1/ProductosCombos","type":0,"val":"ProductosCombos","end":""}],
    types: placeholder as Registry['productos.productos_combos']['types'],
  },
  'categorias.categorias_existentes': {
    methods: ["POST"],
    pattern: '/api/v1/CategoriasExistentes',
    tokens: [{"old":"/api/v1/CategoriasExistentes","type":0,"val":"api","end":""},{"old":"/api/v1/CategoriasExistentes","type":0,"val":"v1","end":""},{"old":"/api/v1/CategoriasExistentes","type":0,"val":"CategoriasExistentes","end":""}],
    types: placeholder as Registry['categorias.categorias_existentes']['types'],
  },
  'categorias.categorias_combos': {
    methods: ["POST"],
    pattern: '/api/v1/CategoriasCombos',
    tokens: [{"old":"/api/v1/CategoriasCombos","type":0,"val":"api","end":""},{"old":"/api/v1/CategoriasCombos","type":0,"val":"v1","end":""},{"old":"/api/v1/CategoriasCombos","type":0,"val":"CategoriasCombos","end":""}],
    types: placeholder as Registry['categorias.categorias_combos']['types'],
  },
  'categorias.guardar_categoria': {
    methods: ["PUT"],
    pattern: '/api/v1/CategoriasGuardar',
    tokens: [{"old":"/api/v1/CategoriasGuardar","type":0,"val":"api","end":""},{"old":"/api/v1/CategoriasGuardar","type":0,"val":"v1","end":""},{"old":"/api/v1/CategoriasGuardar","type":0,"val":"CategoriasGuardar","end":""}],
    types: placeholder as Registry['categorias.guardar_categoria']['types'],
  },
  'marcas.marcas_existentes': {
    methods: ["POST"],
    pattern: '/api/v1/MarcasExistentes',
    tokens: [{"old":"/api/v1/MarcasExistentes","type":0,"val":"api","end":""},{"old":"/api/v1/MarcasExistentes","type":0,"val":"v1","end":""},{"old":"/api/v1/MarcasExistentes","type":0,"val":"MarcasExistentes","end":""}],
    types: placeholder as Registry['marcas.marcas_existentes']['types'],
  },
  'marcas.marcas_combos': {
    methods: ["POST"],
    pattern: '/api/v1/MarcasCombos',
    tokens: [{"old":"/api/v1/MarcasCombos","type":0,"val":"api","end":""},{"old":"/api/v1/MarcasCombos","type":0,"val":"v1","end":""},{"old":"/api/v1/MarcasCombos","type":0,"val":"MarcasCombos","end":""}],
    types: placeholder as Registry['marcas.marcas_combos']['types'],
  },
  'marcas.guardar_marca': {
    methods: ["PUT"],
    pattern: '/api/v1/MarcasGuardar',
    tokens: [{"old":"/api/v1/MarcasGuardar","type":0,"val":"api","end":""},{"old":"/api/v1/MarcasGuardar","type":0,"val":"v1","end":""},{"old":"/api/v1/MarcasGuardar","type":0,"val":"MarcasGuardar","end":""}],
    types: placeholder as Registry['marcas.guardar_marca']['types'],
  },
  'inventarios.registrar_inventario': {
    methods: ["PUT"],
    pattern: '/api/v1/GuardarInventario',
    tokens: [{"old":"/api/v1/GuardarInventario","type":0,"val":"api","end":""},{"old":"/api/v1/GuardarInventario","type":0,"val":"v1","end":""},{"old":"/api/v1/GuardarInventario","type":0,"val":"GuardarInventario","end":""}],
    types: placeholder as Registry['inventarios.registrar_inventario']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
