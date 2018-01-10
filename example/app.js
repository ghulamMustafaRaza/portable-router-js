(function () {
    const router = new Router({
        appId: 'app',
        routes: [{
            route: "/home",
            render: ({ section, a }, history) => `<h1>Home</h1>`
        },
        {
            route: "/home/:section/{a}",
            render: ({ section, a }, history) => `<h1>home/${section}${a && `/${a}` || ''}</h1>`
        },
        {
            route: "/products/{productid}",
            render: ({ productid }, history) => productid ?
                `<h1>productid: ${productid}</h1>`
                : `
                <h1>Goto Progicts</h1>
                ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => `<a href="/products/${a}" class="router-link">/products/${a}</a>`).join('<br/>')}`
        },
        {
            route: "*",
            render: (_, __, route) => `<h1>Route: ${route} Not Mached!</h1>`
        }]
    })
    window.router = router
})()