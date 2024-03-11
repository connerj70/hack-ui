import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  makeStyles,
  ThemeProvider,
  Theme,
  createTheme,
} from "@mui/material";

const theme: Theme = createTheme();

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
    "& .MuiButton-root": {
      margin: theme.spacing(2, 0),
    },
  },
}));

interface FormData {
  name: string;
  email: string;
  message: string;
}

function DevicesPage() {
  const classes = useStyles();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData); // Do something with form data
    // You can submit form data to an API, update state, etc.
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div className={classes.formContainer}>
          <Typography variant="h4" gutterBottom>
            Simple Form
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default DevicesPage;
