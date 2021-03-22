import React from "react";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import { Button, TextField } from "@material-ui/core";

function LoginForm({
  className,
  handleOnSubmit,
  isLoading,
  username,
  setUserName,
  password,
  setPassword,
}) {
  return (
    <form className={className.form} onSubmit={handleOnSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Usuario"
        autoComplete="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        autoFocus
        name="username"
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      {isLoading ? (
        <BackdropSpinner isLoading={!isLoading} />
      ) : (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={className.submit}
        >
          Entrar
        </Button>
      )}
    </form>
  );
}

export default LoginForm;
