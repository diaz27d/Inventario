/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'nombre_label_input_variables.exportar_label_input': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/NombreLabelInputVariables'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/nombre_label_input_variables_controller').default['exportarLabelInput']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/nombre_label_input_variables_controller').default['exportarLabelInput']>>>
    }
  }
  'productos.productos_existentes': {
    methods: ["POST"]
    pattern: '/api/v1/ProductosExistentes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['productosExistentes']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['productosExistentes']>>>
    }
  }
  'productos.guardar_producto': {
    methods: ["POST"]
    pattern: '/api/v1/GuardarProducto'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['guardarProducto']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['guardarProducto']>>>
    }
  }
  'productos.actualizar_producto': {
    methods: ["PUT"]
    pattern: '/api/v1/ActualizarProducto'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['actualizarProducto']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['actualizarProducto']>>>
    }
  }
  'productos.productos_combos': {
    methods: ["POST"]
    pattern: '/api/v1/ProductosCombos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['productosCombos']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/productos_controller').default['productosCombos']>>>
    }
  }
  'categorias.categorias_existentes': {
    methods: ["POST"]
    pattern: '/api/v1/CategoriasExistentes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categorias_controller').default['CategoriasExistentes']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categorias_controller').default['CategoriasExistentes']>>>
    }
  }
  'categorias.categorias_combos': {
    methods: ["POST"]
    pattern: '/api/v1/CategoriasCombos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categorias_controller').default['CategoriasCombos']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categorias_controller').default['CategoriasCombos']>>>
    }
  }
  'categorias.guardar_categoria': {
    methods: ["PUT"]
    pattern: '/api/v1/CategoriasGuardar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categorias_controller').default['guardarCategoria']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categorias_controller').default['guardarCategoria']>>>
    }
  }
  'marcas.marcas_existentes': {
    methods: ["POST"]
    pattern: '/api/v1/MarcasExistentes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/marcas_controller').default['MarcasExistentes']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/marcas_controller').default['MarcasExistentes']>>>
    }
  }
  'marcas.marcas_combos': {
    methods: ["POST"]
    pattern: '/api/v1/MarcasCombos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/marcas_controller').default['MarcasCombos']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/marcas_controller').default['MarcasCombos']>>>
    }
  }
  'marcas.guardar_marca': {
    methods: ["PUT"]
    pattern: '/api/v1/MarcasGuardar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/marcas_controller').default['guardarMarca']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/marcas_controller').default['guardarMarca']>>>
    }
  }
  'inventarios.registrar_inventario': {
    methods: ["PUT"]
    pattern: '/api/v1/GuardarInventario'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventarios_controller').default['registrarInventario']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventarios_controller').default['registrarInventario']>>>
    }
  }
}
