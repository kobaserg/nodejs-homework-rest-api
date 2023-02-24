class HW4NodejsError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends HW4NodejsError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class UserEmailVerifyError extends HW4NodejsError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ParametersError extends HW4NodejsError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ConflictError extends HW4NodejsError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class NotAuthorizedError extends HW4NodejsError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class UserVerifyError extends HW4NodejsError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

module.exports = {
  ValidationError,
  ParametersError,
  NotAuthorizedError,
  HW4NodejsError,
  ConflictError,
  UserVerifyError,
  UserEmailVerifyError,
};
