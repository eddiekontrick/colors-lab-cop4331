const { saveCookie, readCookie, setUser } = require('./public/js/code');

describe('Cookie Tests', () => {

    beforeEach(() => {
        global.document = {
            cookie: ""
        };

        global.window = {
            location: { href: "" }
        };
    });

    test('saveCookie stores correct values', () => {
        setUser("Eddie", "Test", 99);

        saveCookie();

        expect(document.cookie).toContain("firstName=Eddie");
        expect(document.cookie).toContain("lastName=Test");
        expect(document.cookie).toContain("userId=99");
    });

    test('readCookie parses cookie correctly', () => {
        document.cookie = "firstName=John;lastName=Doe;userId=42";

        readCookie();

        expect(global.window.location.href).toBe(""); // not redirected
    });

});