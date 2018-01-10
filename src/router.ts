import Route from './route'

export class Base {
    constructor() {
        window.onpopstate = (a: any) => {
            this.applyRoutes(a.target.location.pathname)
        }
        window.onpushstate = (a: any) => {
            this.applyRoutes(a.target.location.pathname)
        }
    }
    public routers = [];
    public applyRoutes = (a) => this.routers.map((router) => {
        router.applyRoute(a)
    })
    public addEvent = () => {
        if (this.routers.length) {
            const links = document.getElementsByClassName('router-link')
            for (let i = 0; i < links.length; i++) {
                links[i].onclick = () => this.routers[0].changeRoute(links[i].href)
            }
        }
        else throw new Error('No Router Spacified')
    }
}    

export default class extends Base {
    private routes;
    private app: any;
    constructor({ routes, appId }) {
        super()
        this.routes = new Array();
        this.app = document.getElementById(appId);
        if (!this.app) {
            this.app = document.createElement('div')
            this.app.id = appId
            document.body.appendChild(this.app)
        }
        // console.log(routes)
        routes.map(a => {
            this.registerRoute(a.route, a.render)
        })
        this.routers.push(this)
        this.applyRoute(window.location.pathname)
        this.addEvent()
    }
    //Here we use a somewhat different style of create the prototype
    //than for the Route prototype. Both ways are valid. 
    //I'm using them mixed here, but It's probably wise not to do that.
    //And stick to a single pattern. Here I'm doing it to show both possibilities
    private registerRoute(route, fn, paramObject = { scope: undefined }) {
        //We'll have route and function as named parameters
        //and all the future optional parameters in a single object.
        //Right now we just have scope as a optional parameters
        var scope = paramObject && paramObject.scope || {};
        return this.routes[this.routes.length] = new Route({
            route: route,
            fn: fn,
            scope: scope
        });
    }
    public applyRoute(route) {
        //iterate all routes
        let matched = false
        // console.log(route)
        for (var i = 0, j = this.routes.length; i < j; i++) {
            var sRoute = this.routes[i];
            //match route
            if (sRoute.matches(route)) {
                //if true call callback function with the proper scope
                let html = sRoute.fn.apply(sRoute.scope, [sRoute.getArgumentsValues(route), history, route]);
                this.app.innerHTML = html
                matched = true
                break;
            }
        }
        if (!matched) {
            this.app.innerHTML = '<h1>not found</h1>'
            // console.log('nf')
        }
    }
    public changeRoute(r) {
        r = r.split(window.location.origin).filter(a => a)[0]
        event.preventDefault()
        this.applyRoutes(r)
        history.pushState({}, r, r)
        this.addEvent()
        return false
    }
    public goBack() {
        event.preventDefault()
        history.back()
        return false
    }
    public goForward() {
        event.preventDefault()
        history.forward()
        return false
    }
}
