// Development Environment Configurations
const DEV = {
    app: {
        port: 8000,
    },
    db: {
        host: 'ds237669.mlab.com',
        port: 37669,
        name: 'hapijs-advanced',
        user: 'demo',
        password: 'demo123'
    }
};

// QA Environment Configurations
const QA = {
    app: {
        port: 8000,
    },
    db: {
        host: 'ds237669.mlab.com',
        port: 37669,
        name: 'hapijs-advanced',
        user: 'demo',
        password: 'demo123'
    }
};

// Staging Environment Configurations   
const STG = {
    app: {
        port: 8000,
    },
    db: {
        host: 'ds237669.mlab.com',
        port: 37669,
        name: 'hapijs-advanced',
        user: 'demo',
        password: 'demo123'
    }
};

// Production Environment Configurations   
const PRD = {
    app: {
        port: 8000,
    },
    db: {
        host: 'ds237669.mlab.com',
        port: 37669,
        name: 'hapijs-advanced',
        user: 'demo',
        password: 'demo123'
    }
};

const config = [DEV, QA, STG, PRD];

module.exports = config[0];
