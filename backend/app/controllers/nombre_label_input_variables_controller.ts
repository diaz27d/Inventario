 import type { HttpContext } from '@adonisjs/core/http'

export default class NombreLabelInputVariablesController {

    async exportarLabelInput({response}: HttpContext){
        const label = [
            { id: 1, title: 'Sistema de Inventario' },
            { id: 2, title: 'Tienda el Ciclista' },
        ]

        return response.json(label)
    }
}