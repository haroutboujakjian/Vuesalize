module.exports = {
    title: 'Vuesalize',
    themeConfig: {
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Rationale', link: '/rationale.md'},
        ],
        sidebar: [
            '/',
        ],
        sidebarDepth: 2,
        lastUpdated: 'Last Updated'
    },
    markdown: {
        lineNumbers: true
    },
    dest: 'docs',
    base: '/Vuesalize/'
}