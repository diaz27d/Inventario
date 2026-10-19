/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  nombreLabelInputVariables: {
    exportarLabelInput: typeof routes['nombre_label_input_variables.exportar_label_input']
  }
  productos: {
    productosExistentes: typeof routes['productos.productos_existentes']
    guardarProducto: typeof routes['productos.guardar_producto']
    actualizarProducto: typeof routes['productos.actualizar_producto']
    productosCombos: typeof routes['productos.productos_combos']
  }
  categorias: {
    categoriasExistentes: typeof routes['categorias.categorias_existentes']
    categoriasCombos: typeof routes['categorias.categorias_combos']
    guardarCategoria: typeof routes['categorias.guardar_categoria']
  }
  marcas: {
    marcasExistentes: typeof routes['marcas.marcas_existentes']
    marcasCombos: typeof routes['marcas.marcas_combos']
    guardarMarca: typeof routes['marcas.guardar_marca']
  }
  inventarios: {
    registrarInventario: typeof routes['inventarios.registrar_inventario']
  }
}
