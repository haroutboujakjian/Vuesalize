import Components from "./main.js"

export default {
    install: (app, options) => {
        for (const prop in Components) {
            if (Components.hasOwnProperty(prop)) {
                const component = Components[prop]
                app.component(component.name, component)
            }
        }
        // for (const component in Components){
        //     app.component(component.name, component)
        // }
    },
}
