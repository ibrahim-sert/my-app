import { Box, Card, Grid, Typography } from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const inter = Inter({ subsets: ["latin"] });

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Yıl girişi yapmalısınız."),
  fValue: Yup.number()
    .typeError("Numara giriniz")
    .required("Lütfen maaş giriniz"),
  bValue: Yup.number()
    .typeError("Numara giriniz")
    .required("Lütfen maaş giriniz"),
});

export default function Home() {
  const [posts, setPosts] = useState([]);
  const BASE_URL = "http://localhost:4000/backend";

  //! Get işlemi

  const getData = async () => {
    try {
      const { data } = await axios(BASE_URL);
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //! Post işlemi
  const postData = async (info) => {
    console.log("post");
    try {
      await axios.post(`${BASE_URL}`, info);
      await getData();
    } catch (error) {
      console.log(error);
    }
  };

  //! Put işlemi
  const putData = async (info) => {
    const { date } = info;
    const putValue = posts.find((p) => p.date === date);
    try {
      await axios.put(`${BASE_URL}/${putValue.id}`, info);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  //! Delete işlemi
  const delData = async (info) => {
    const { date } = info;
    const putValue = posts.find((p) => p.date === date);
    try {
      await axios.delete(`${BASE_URL}/${putValue.id}`);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const option = {
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories:
        posts?.sort((a, b) => a.date - b.date).map((d) => d.date) || [],
    },
  };

  const series = [
    {
      name: "Frontend Maaşları",
      data: Object.values(posts)
        ?.sort((a, b) => a.date - b.date)
        .map((v) => v.fValue),
    },
    {
      name: "Backend Maaşları",
      data: Object.values(posts)
        ?.sort((a, b) => a.date - b.date)
        .map((v) => v.bValue),
    },
  ];

  return (
    <Formik
      initialValues={{
        id: 0,
        date: "",
        fValue: "",
        bValue: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        // e.preventDefault();
        if (values?.id) {
          putData(values);
        } else {
          postData(values);
        }

        actions.resetForm();
        actions.setSubmitting(false);
      }}
    >
      {(formikProps) => (
        <Grid
          container
          justifyContent="center"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap={2}
        >
          <Grid m={4} item gridColumn="span 8" height={"700px"}>
            <Card>
              <Typography p={2}>
                Yıllara Göre Frontend ve Backend Maaş Tabloasu{" "}
              </Typography>
              <ApexChart
                type="line"
                options={option}
                series={series}
                height={500}
                width={1000}
              />
            </Card>
            <Box m={4}>
              <Typography>
                * Girilen verileri kaydetmek için lütfen Submit tuşuna basınız.
              </Typography>
              <Typography>
                ** Girilen verileri sıfırlamak için lütfen Reset tuşuna basınız.
              </Typography>
              <Typography>
                *** Girilen verileri değiştirmek için lütfen değiştirmek
                istediğiniz yıl ile beraber güncel verileri doldurarak Update
                tuşuna basınız.
              </Typography>
              <Typography>
                **** Girilen verileri silmek için lütfen silmek istediğiniz yılı
                yazarak Delete tuşuna basınız.
              </Typography>
            </Box>
          </Grid>

          <Grid m={4} item gridColumn="span 4">
            <Form
              className="basis-1/3 h-[500px] rounded-lg  flex flex-col justify-center w-[full]"
              onSubmit={formikProps.handleSubmit}
            >
              <div className="mb-2 mt-6 flex  flex-col justify-center items-center h-full mx-auto w-full">
                <div className="flex flex-col gap-2 w-full text-white">
                  <label htmlFor="date">Tarih:</label>

                  <Field
                    name="date"
                    id="fed"
                    type="number"
                    variant="outlined"
                    // value={info?.date}
                    // onChange={handleChange}
                    value={formikProps.values.date}
                    onChange={formikProps.handleChange}
                    required
                    className="mb-5 bg-gray-500 text-white placeholder-white placeholder:opacity-50 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Yıl Giriniz"
                  />
                  <ErrorMessage
                    className=" text-red-700 mb-2 invalid-feedback"
                    name="date"
                    component="div"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full text-white">
                  <label htmlFor="fValue">Frontend Dev. Maaşı:</label>
                  <Field
                    name="fValue"
                    id="fValue"
                    type="number"
                    variant="outlined"
                    // value={info?.frontendSalary}
                    // onChange={handleChange}
                    value={formikProps.values.fValue}
                    onChange={formikProps.handleChange}
                    required
                    className="mb-5 bg-gray-500 text-white placeholder-white placeholder:opacity-50 text-sm rounded-lg block w-full p-2.5  "
                    placeholder="Maaş Giriniz"
                  />
                  <ErrorMessage
                    className=" text-red-700 mb-2 invalid-feedback"
                    name="fValue"
                    component="div"
                  />
                </div>

                <div className="flex flex-col gap-2 mb-5 w-full text-white">
                  <label htmlFor="bValue">Backend Dev. Maaşı:</label>
                  <Field
                    name="bValue"
                    id="bValue"
                    type="number"
                    variant="outlined"
                    value={formikProps.values.bValue}
                    onChange={formikProps.handleChange}
                    required
                    className="mb-5 bg-gray-500 text-white placeholder-white placeholder:opacity-50 text-sm rounded-lg block w-full p-2.5 "
                    placeholder="Maaş Giriniz"
                  />
                  <ErrorMessage
                    className=" text-red-700 mb-2"
                    name="bValue"
                    component="div"
                  />
                </div>
                <div className=" w-full flex flex-row justify-around gap-3">
                  <button
                    type="submit"
                    className="bg-green-700 rounded-xl my-2 py-1 px-4 w-full text-white "
                  >
                    Submit
                  </button>
                  <button
                    onClick={formikProps.resetForm}
                    type="reset"
                    className="bg-blue-500 rounded-xl my-2 py-1 px-4 w-full text-white"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => putData(formikProps.values)}
                    type="button"
                    className="bg-yellow-500 rounded-xl my-2 py-1 px-4 w-full text-white "
                  >
                    Update
                  </button>
                  <button
                    onClick={() => delData(formikProps.values)}
                    type="button"
                    className="bg-red-700 rounded-xl my-2 py-1 px-4 w-full text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Form>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
