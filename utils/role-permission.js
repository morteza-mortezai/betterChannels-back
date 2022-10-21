exports.rp = {
    'SUPERADMIN': [
        { '/order/all': 'GET' },
    ],
    'USER': [
        { '/order/all': 'GET' },
        { '/media/create': 'POST' },
        { '/category/create': 'POST' },
        { '/location': 'POST' },
    ]
}
