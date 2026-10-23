/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router.get('NombreLabelInputVariables', [controllers.NombreLabelInputVariables, 'exportarLabelInput'])
    router.post('ProductosExistentes', [controllers.Productos, 'productosExistentes'])
    router.post('GuardarProducto', [controllers.Productos, 'guardarProducto'])
    router.put('ActualizarProducto', [controllers.Productos, 'actualizarProducto'])
    router.post('ProductosCombos', [controllers.Productos, 'productosCombos'])
    router.post('CategoriasExistentes', [controllers.Categorias, 'CategoriasExistentes'])
    router.post('CategoriasCombos', [controllers.Categorias, 'CategoriasCombos'])
    router.put('CategoriasGuardar', [controllers.Categorias, 'guardarCategoria'])
    router.put('ActualizarCategorias', [controllers.Categorias, 'actualizarCategoria'])
    router.post('MarcasExistentes', [controllers.Marcas, 'MarcasExistentes'])
    router.put('ActualizarMarca', [controllers.Marcas, 'actualizarMarca'])
    router.post('MarcasCombos', [controllers.Marcas, 'MarcasCombos'])
    router.put('MarcasGuardar', [controllers.Marcas, 'guardarMarca'])
    router.put('GuardarInventario', [controllers.Inventarios, 'registrarInventario'])
    router.post('ClientesExistentes', [controllers.Clientes, 'clientesExistentes'])
    router.put('GuardarClientes', [controllers.Clientes, 'guardarCliente'])
    router.put('ActualizarCliente', [controllers.Clientes, 'actualizarCliente'])    
    router.post('ClienteCombo', [controllers.Clientes, 'clientesCombo'])  
    router.post('MediosPago', [controllers.Clientes, 'MediosPagoCombo']) 
    router.post('DeudasClientes', [controllers.Clientes, 'DeudasClientes']) 
    router.post('VentasPendientesCliente', [controllers.Clientes, 'ventasPendientesCliente']) 
    router.post('DetalleVenta', [controllers.Clientes, 'detalleVenta']) 
    router.put('RegistrarAbono', [controllers.Clientes, 'registrarAbono'])
    router.post('HistorialMovimientos', [controllers.Inventarios, 'historialMovimientos'])
    router.post('Dasboard', [controllers.Dasboards, 'dashboard'])
    router.post('NotificacionesProducto', [controllers.Dasboards, 'notificacionesStock'])
  })
  .prefix('/api/v1')
