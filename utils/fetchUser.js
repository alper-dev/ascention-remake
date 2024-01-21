const { API } = require("vandal.js");

/**
 * @param {string} usernameOrFullname 
 * @param {string} _tag 
 */
module.exports = async function fetchUser(usernameOrFullname, _tag) {
    let username, tag;
    if (!_tag && usernameOrFullname) {
        username = usernameOrFullname.split('#')[0];
        tag = usernameOrFullname.split('#')[1];
    } else {
        username = usernameOrFullname;
        tag = _tag;
    };
    try {
        const raw = await API.fetchUser(username, tag);
        return raw;
    } catch (err) {
        return {
            error: err
        };
    };
};