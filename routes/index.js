'use strict';

const express = require('express');
const router = express.Router();
const validator = require('validator');

router.get('/', (req, res, next) => {
    res.redirect(301, '/checkout');
});

router.get('/checkout', (req, res, next) => {
    res.render('index', {
       title: 'Checkout',
       section: 'info'
    });
});

router.get('/billing-shipping', (req, res, next) => {
    if(req.session.user) {
        res.render('billing-shipping', {
            title: 'Billing and shipping',
            section: 'billing',
            user: req.session.user
        });
    } else {
        res.redirect('/checkout');
    }
});

router.get('/payment', (req, res, next) => {
    if(!req.session.user) {
        res.redirect('/checkout');
        return;
    }

    const { user } = req.session;

    if(!user.billing) {
        res.redirect('/billing-shipping');
        return;
    }

    res.render('payment', {
        title: 'Payment',
        section: 'payment',
        user
    });
});

router.get('/thank-you', (req, res, next) => {
    if(req.session.user && req.session.user.billing) {
        res.render('thank-you', {
            title: 'Order complete',
            section: 'thank-you',
            user: req.session.user
        });
    } else {
        res.redirect('/checkout');
    }
});

router.post('/billing-shipping', (req, res, next) => {
    const post = req.body;
    const errors = [];

    if(validator.isEmpty(post.billing_first_name)) {
        errors.push({
            param: 'billing_first_name',
            msg: 'Required field.'
        });
    }
    if(validator.isEmpty(post.billing_last_name)) {
        errors.push({
            param: 'billing_last_name',
            msg: 'Required field.'
        });
    }
    if(!validator.isEmail(post.billing_email)) {
        errors.push({
            param: 'billing_email',
            msg: 'Invalid e-mail address.'
        });
    }

    if(validator.isEmpty(post.billing_address)) {
        errors.push({
            param: 'billing_address',
            msg: 'Required field.'
        });
    }

    if(validator.isEmpty(post.billing_city)) {
        errors.push({
            param: 'billing_city',
            msg: 'Required field.'
        });
    }

    if(!validator.isNumeric(post.billing_zip)) {
        errors.push({
            param: 'billing_zip',
            msg: 'Invalid postal code.'
        });
    }

    if(!post.same_as) {
        if(validator.isEmpty(post.shipping_first_name)) {
            errors.push({
                param: 'shipping_first_name',
                msg: 'Required field.'
            });
        }
        if(validator.isEmpty(post.shipping_last_name)) {
            errors.push({
                param: 'shipping_last_name',
                msg: 'Required field.'
            });
        }
        if(!validator.isEmail(post.shipping_email)) {
            errors.push({
                param: 'shipping_email',
                msg: 'Invalid e-mail address.'
            });
        }
    
        if(validator.isEmpty(post.shipping_address)) {
            errors.push({
                param: 'shipping_address',
                msg: 'Required field.'
            });
        }
    
        if(validator.isEmpty(post.shipping_city)) {
            errors.push({
                param: 'shipping_city',
                msg: 'Required field.'
            });
        }
    
        if(!validator.isNumeric(post.shipping_zip)) {
            errors.push({
                param: 'shipping_zip',
                msg: 'Invalid postal code.'
            });
        }
    }

    if(errors.length > 0) {
        res.json({ errors });
    } else {
        const billing = {};
        

        for(let prop in post) {
            if(prop.startsWith('billing')) {
                let key = prop.replace('billing', '').replace(/_/g, '');
                billing[key] = post[prop];
            }
        }

        req.session.user.billing = billing;

        if(!post.same_as) {
            const shipping = {};

            for(let prop in post) {
                if(prop.startsWith('shipping')) {
                    let key = prop.replace('shipping', '').replace(/_/g, '');
                    shipping[key] = post[prop];
                }
            }

            req.session.user.shipping = shipping;
        }

        res.json({ saved: true });
    }
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if(!validator.isEmail(email)) {
        errors.push({
            param: 'email',
            msg: 'Invalid e-mail address.'
        });
    }

    if(validator.isEmpty(password)) {
        errors.push({
            param: 'password',
            msg: 'Invalid password.'
        });
    }

    if(errors.length) {
        res.json({ errors });
    } else {
        if(!req.session.user) {
            req.session.user = { email };
        }
        res.json({ loggedIn: true });
    }
});

router.post('/register', (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if(validator.isEmpty(name)) {
        errors.push({
            param: 'name',
            msg: 'Invalid name.'
        });
    }

    if(!validator.isEmail(email)) {
        errors.push({
            param: 'email',
            msg: 'Invalid e-mail address.'
        });
    }

    if(validator.isEmpty(password)) {
        errors.push({
            param: 'password',
            msg: 'Invalid password.'
        });
    }

    if(errors.length) {
        res.json({ errors });
    } else {
        if(!req.session.user) {
            req.session.user = { name, email };
        }
        res.json({ registered: true });
    }
});
module.exports = router;
