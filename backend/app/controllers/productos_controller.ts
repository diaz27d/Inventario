 import type { HttpContext } from '@adonisjs/core/http'
 import db from '@adonisjs/lucid/services/db'

export default class ProductosController {
    
    async productosExistentes({request, response}: HttpContext){

        const page = request.input('page', 1)
        const limit = request.input('limit', 5)
        const busqueda = request.input('busqueda', '')

        const productos = await db
        .from('productos as p')
        .join(
            'categorias as c',
            'p.categoria_producto',
            'c.id_categoria'
        )
        .join(
            'marca as m',
            'p.marca_producto',
            'm.id_marca'
        )
        .where((query) => {

            if (busqueda) {

            query
                .whereLike(
                'p.nombre_producto',
                `%${busqueda}%`
                )
                .orWhereLike(
                'c.nombre_categoria',
                `%${busqueda}%`
                )
                .orWhereLike(
                'm.nombre_marca',
                `%${busqueda}%`
                )
            }
        })
        .select(
            'p.id_producto',
            'p.nombre_producto',
            'c.nombre_categoria as categoria_producto',
            'c.id_categoria', 
            'm.id_marca',
            'm.nombre_marca as marca_producto',
            'p.precio_producto',
            'p.precio_adquirido_producto',
            'p.cantidad_producto',
            'p.descripcion_producto',
            'p.estado_producto'
        )
        .orderBy('p.cantidad_producto', 'asc')
        .paginate(page, limit);
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(productos)
    }

    async guardarProducto({request, response }: HttpContext) {

        const datos = request.only([
            'nombre_producto',
            'id_categoria',
            'id_marca',
            'precio_producto',
            'precio_adquirido_producto',
            'cantidad_producto',
            'descripcion_producto',
            'email'
        ])

        const fecha = new Date()
            .toLocaleString('sv-SE', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
            .replace(' ', ' ')

        if (!datos.nombre_producto?.trim()) {
        return response.badRequest({
            success: false,
            message: 'Debe ingresar el nombre del producto'
        })
        }

        if (!datos.id_categoria) {
        return response.badRequest({
            success: false,
            message: 'Debe seleccionar una categoría'
        })
        }

        if (!datos.id_marca) {
        return response.badRequest({
            success: false,
            message: 'Debe seleccionar una marca'
        })
        }

        if (Number(datos.precio_producto) <= 0) {
        return response.badRequest({
            success: false,
            message: 'El precio debe ser mayor a cero'
        })
        }

        if (Number(datos.precio_adquirido_producto) <= 0) {
        return response.badRequest({
            success: false,
            message: 'El precio adquirido debe ser mayor a cero'
        })
        }

        if (Number(datos.cantidad_producto) <= 0) {
        return response.badRequest({
            success: false,
            message: 'La cantidad debe ser mayor a cero'
        })
        }

        if (!datos.descripcion_producto?.trim()) {
        return response.badRequest({
            success: false,
            message: 'Debe ingresar una descripción'
        })
        }
        
        const existe = await db
            .from('productos')
            .where('nombre_producto', datos.nombre_producto)
            .where('categoria_producto', datos.id_categoria)
            .where('marca_producto', datos.id_marca)
            .first()

        if (existe) {
            return response.badRequest({
                success: false,
                message: 'Ya existe un producto con ese nombre, categoria y marca'
            })
            }

        const cantidadProductosPermitidos = await db
            .from('parametros')
            .select(
            'valor'
            )
            .where(
            'id_parametro', 2
        )

        const Numeroproductos =
            await db
            .from('productos')
            .count(
                '* as total'
            )
            .first()

        if(cantidadProductosPermitidos[0].valor == 0 && cantidadProductosPermitidos[0].valor <= Numeroproductos){

            const [id] = await db
            .table('productos')
            .insert({
                nombre_producto: datos.nombre_producto,
                categoria_producto: datos.id_categoria,
                marca_producto: datos.id_marca,
                precio_producto: datos.precio_producto,
                precio_adquirido_producto: datos.precio_adquirido_producto,
                cantidad_producto: datos.cantidad_producto,
                descripcion_producto: datos.descripcion_producto,
                email: datos.email,
                codigo_producto: (datos.nombre_producto + datos.id_categoria + datos.id_marca),
                estado_producto: 1,
                fecha_producto: fecha
            })

            return response.ok({
                success: true,
                id_producto: id,
                message: 'Producto guardado correctamente'
            })
            
        }else{
            return response.badRequest({
                success: false,
                message: 'Ya se alcanzo el número de productos máximos, por favor comunicarse con el administrador.'
            })
        }
    }

    async actualizarProducto({ request, response }: HttpContext) {

        const datos = request.all()

        await db
            .from('productos')
            .where(
            'id_producto',
            datos.id_producto
            )
            .update({
            nombre_producto:
                datos.nombre_producto,

            categoria_producto:
                datos.categoria_producto,

            marca_producto:
                datos.marca_producto,

            precio_producto:
                datos.precio_producto,

            precio_adquirido_producto:
                datos.precio_adquirido_producto,

            cantidad_producto:
                datos.cantidad_producto,

            descripcion_producto: 
                datos.descripcion_producto,

            estado_producto: 
                datos.estado_producto
            })

            return response.ok({
                message:
                'Producto actualizado correctamente'
            })
    }

    async productosCombos({response}: HttpContext){

        const productos = await db
        .from('productos as p')
        .where('p.estado_producto','1')
        .select(
            'p.id_producto',
            'p.nombre_producto',
            'P.categoria_producto as categoria_producto',
            'P.marca_producto',
            'p.precio_producto',
            'p.precio_adquirido_producto',
            'p.cantidad_producto',
            'p.descripcion_producto',
            'p.estado_producto'
        )
        .orderBy('p.id_producto', 'desc')
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(productos)
    }
}