function checkEmailStudent(email) {
    const regex = /^([a-zA-Z0-9._%+-]+)@student\.tdtu\.edu\.vn$/;
    return regex.test(email);
}

export default checkEmailStudent;