import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'nombre_label_input_variables.exportar_label_input': { paramsTuple?: []; params?: {} }
    'productos.productos_existentes': { paramsTuple?: []; params?: {} }
    'productos.guardar_producto': { paramsTuple?: []; params?: {} }
    'productos.actualizar_producto': { paramsTuple?: []; params?: {} }
    'productos.productos_combos': { paramsTuple?: []; params?: {} }
    'categorias.categorias_existentes': { paramsTuple?: []; params?: {} }
    'categorias.categorias_combos': { paramsTuple?: []; params?: {} }
    'categorias.guardar_categoria': { paramsTuple?: []; params?: {} }
    'marcas.marcas_existentes': { paramsTuple?: []; params?: {} }
    'marcas.marcas_combos': { paramsTuple?: []; params?: {} }
    'marcas.guardar_marca': { paramsTuple?: []; params?: {} }
    'inventarios.registrar_inventario': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'nombre_label_input_variables.exportar_label_input': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'nombre_label_input_variables.exportar_label_input': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'productos.productos_existentes': { paramsTuple?: []; params?: {} }
    'productos.guardar_producto': { paramsTuple?: []; params?: {} }
    'productos.productos_combos': { paramsTuple?: []; params?: {} }
    'categorias.categorias_existentes': { paramsTuple?: []; params?: {} }
    'categorias.categorias_combos': { paramsTuple?: []; params?: {} }
    'marcas.marcas_existentes': { paramsTuple?: []; params?: {} }
    'marcas.marcas_combos': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'productos.actualizar_producto': { paramsTuple?: []; params?: {} }
    'categorias.guardar_categoria': { paramsTuple?: []; params?: {} }
    'marcas.guardar_marca': { paramsTuple?: []; params?: {} }
    'inventarios.registrar_inventario': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}