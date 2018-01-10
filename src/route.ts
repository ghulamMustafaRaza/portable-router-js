
export default class {
    private route: string;
    private fn: void;
    private scope: any;
    private rules: any;
    private routeArguments: Array<string>;
    private optionalRouteArguments: Array<string>;
    private routeParts: Array<string>;
    
    constructor (config: {route: any, fn: any, scope?: any, rules?: any}) {
        this.route = config.route;
        this.fn = config.fn;
        this.scope = config.scope ? config.scope : null;
        this.rules = config.rules ? config.rules : {};
    
        this.routeArguments = Array();
        this.optionalRouteArguments = Array();
    
        //Create the route arguments if they exist
        this.routeParts = this.route.split("/");
        for (var i = 0, j = this.routeParts.length; i < j; i++) {
            var rPart = this.routeParts[i]
    
            //See if there are pseudo macro's in the route
    
            //will fetch all {id} parts of the route. So the manditory parts
            if (rPart.substr(0, 1) == "{" && rPart.substr(rPart.length - 1, 1) == "}") {
                var rKey = rPart.substr(1, rPart.length - 2);
                this.optionalRouteArguments.push(rKey);
            }
            //will fetch all :id: parts of the route. So the optional parts
            if (rPart.substr(0, 1) == ":") {
                var rKey = rPart.substr(1, rPart.length - 2);
                this.routeArguments.push(rKey);
            }
        }
    }
    public matches (route: string): boolean {
        //We'd like to examen every individual part of the incoming route
        var incomingRouteParts = route.split("/");
        //This might seem strange, but assuming the route is correct
        //makes the logic easier, than assuming it is wrong.    
        var routeMatches = true;
        //if the route is shorter than the route we want to check it against we can immidiatly stop.
        if (this.routeParts.slice(0, 2).indexOf('*') !== -1) routeMatches = true;
        else if (incomingRouteParts.length < this.routeParts.length - this.optionalRouteArguments.length) {
            routeMatches = false;
            // console.log(1)
        }
        else {
            // console.log(2)
            var a = incomingRouteParts
            for (var i = 0, j = a.length; i < j && routeMatches; i++) {
                //Lets cache the variables, to prevent variable lookups by the javascript engine
                var iRp = a[i];//current incoming Route Part
                var rP = this.routeParts[i];//current routePart                     
                if (typeof rP == 'undefined') {
                    // console.log(20)
                    //The route almost certainly doesn't match it's longer than the route to check against
                    routeMatches = false;
                }
                else {
                    // console.log(21)
                    var cP0 = rP.substr(0, 1); //char at postion 0
                    var cPe = rP.substr(rP.length - 1, 1);//char at last postion                   
                    if ((cP0 != "{" && cP0 != ":") && (cPe != "}")) {
                        // console.log(210, cP0, cPe, rP, iRp, incomingRouteParts)
                        //This part of the route to check against is not  a pseudo macro, so it has to match exactly
                        if (iRp != rP) {
                            routeMatches = false;
                        }
                    }
                    else {
                        // console.log(211)
                        //Since this is a pseudo macro and there was a value at this place. The route is correct.
                        routeMatches = true;
                    }
                }
            }
        }
        // console.log(routeMatches, route, this)
    
        return routeMatches;
    }
    public getArgumentsValues (route: string): Object {
        //Split the incoming route
        var rRouteParts = route.split("/");
        //Create an array for the values
        var rObject = new Object();
        for (var i = 0, j = this.routeParts.length; i < j; i++) {
            var rP = this.routeParts[i];//current routePart
            var cP0 = rP.substr(0, 1); //char at postion 0
            var cPe = rP.substr(rP.length - 1, 1);//char at last postion
            if ((cP0 == "{" && cPe == "}") || cP0 == ":") {
                let key = cP0 == ":" ? rP.substr(1) : rP.substr(1, rP.length - 2)
                // console.log(key, cP0 == ":", rP.substr(1), rP.substr(1, rP.length - 2))
                //if this part of the route was a pseudo macro,
                //either manditory or optional add this to the array
                rObject[key] = rRouteParts[i];
            }
        }
        return rObject;
    }
}