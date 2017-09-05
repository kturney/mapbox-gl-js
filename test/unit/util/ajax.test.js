'use strict';

const test = require('mapbox-gl-js-test').test;
const ajax = require('../../../src/util/ajax');
const window = require('../../../src/util/window');

test('ajax', (t) => {
    t.beforeEach(callback => {
        window.useFakeXMLHttpRequest();
        callback();
    });

    t.afterEach(callback => {
        window.restore();
        callback();
    });

    t.test('getArrayBuffer, no content error', (t) => {
        window.server.respondWith(request => {
            request.respond(200, {'Content-Type': 'image/png'}, '');
        });
        ajax.getArrayBuffer({ url:'' }, (error) => {
            t.pass('called getArrayBuffer');
            t.ok(error, 'should error when the status is 200 without content.');
            t.end();
        });
        window.server.respond();
    });

    t.test('getArrayBuffer, 404', (t) => {
        window.server.respondWith(request => {
            request.respond(404);
        });
        ajax.getArrayBuffer({ url:'' }, (error) => {
            t.equal(error.status, 404);
            t.end();
        });
        window.server.respond();
    });

    t.test('getJSON', (t) => {
        window.server.respondWith(request => {
            request.respond(200, {'Content-Type': 'application/json'}, '{"foo": "bar"}');
        });
        ajax.getJSON({ url:'' }, (error, body) => {
            t.error(error);
            t.deepEqual(body, {foo: 'bar'});
            t.end();
        });
        window.server.respond();
    });

    t.test('getJSON, invalid syntax', (t) => {
        window.server.respondWith(request => {
            request.respond(200, {'Content-Type': 'application/json'}, 'how do i even');
        });
        ajax.getJSON({ url:'' }, (error) => {
            t.ok(error);
            t.end();
        });
        window.server.respond();
    });

    t.test('getJSON, 404', (t) => {
        window.server.respondWith(request => {
            request.respond(404);
        });
        ajax.getJSON({ url:'' }, (error) => {
            t.equal(error.status, 404);
            t.end();
        });
        window.server.respond();
    });

    t.test('getImage, 404', (t) => {
        window.server.respondWith(request => {
            request.respond(404);
        });
        ajax.getImage({ url:'' }, (error) => {
            t.equal(error.status, 404);
            t.end();
        });
        window.server.respond();
    });

    t.test('getImage, no content error', (t) => {
        window.server.respondWith(request => {
            request.respond(200, {'Content-Type': 'image/png'}, '');
        });
        ajax.getImage({ url:'' }, (error) => {
            t.pass('called getImage');
            t.ok(error, 'should error when the status is 200 without content.');
            t.end();
        });
        window.server.respond();
    });

    t.test('getImage, invalid image', (t) => {
        window.server.respondWith(request => {
            request.respond(200, {'Content-Type': 'image/svg'}, '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>');
        });
        ajax.getImage({ url:'' }, (error) => {
            t.pass('called getImage');
            t.ok(error, 'should error when the image is not a png.');
            t.end();
        });
        window.server.respond();
    });

    t.end();
});
