// "use client"; // don't forget this part if you use app dir to mark the whole
// file as client-side components
import { Card, Grid, Typography } from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const inter = Inter({ subsets: ["latin"] });

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Ay seçmelisiniz"),
  fValue: Yup.number()
    .typeError("Lütfen bir numara girin")
    .required("Numara alanı gereklidir"),
  bValue: Yup.number()
    .typeError("Lütfen bir numara girin")
    .required("Numara alanı gereklidir"),
});

export default function Home() {
  const [posts, setPosts] = useState([]);
  // const [sonuc, setSonuc] = useState("");
  const BASE_URL = "http://localhost:4000/backend";

  const getData = async () => {
    try {
      const { data } = await axios(BASE_URL);
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async (info) => {
    console.log("post");
    try {
      await axios.post(`${BASE_URL}`, info);
      await getData();
    } catch (error) {
      console.log(error);
    }
  };

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

  console.log(posts);

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

  //  posts?.[0]?.data
  //   ?.sort((a, b) => a.date - b.date)
  //   .map((d) => d.date),

  const series = [
    {
      name: "Frontend Salaries",
      data: Object.values(posts)
        ?.sort((a, b) => a.date - b.date)
        .map((v) => v.fValue),
      // posts?.[0]?.data
      //   ?.sort((a, b) => a.date - b.date)
      //   .map((d) => d.value),
    },
    {
      name: "Backend Salaries",
      data: Object.values(posts)
        ?.sort((a, b) => a.date - b.date)
        .map((v) => v.bValue),
      // posts?.[1]?.data
      //   ?.sort((a, b) => a.date - b.date)
      //   .map((d) => d.value),
    },
  ];
  console.log(option);
  console.log(series);
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
          <Grid item gridColumn="span 8" height={"700px"}>
            <Card>
              <Typography>Frontend Salaries</Typography>
              <ApexChart
                type="line"
                options={option}
                series={series}
                height={500}
                width={500}
              />
            </Card>
          </Grid>

          <Grid item gridColumn="span 4">
            <Form
              className="basis-1/3 h-[395px] rounded-lg bg-[#111827] flex flex-col justify-center "
              onSubmit={formikProps.handleSubmit}
            >
              <div className="mb-2 mt-6 flex  flex-col justify-center items-center h-full mx-auto w-80">
                <div className="flex flex-col gap-2 w-full text-white">
                  <label htmlFor="date">Date:</label>

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
                    className="mb-2 bg-gray-500 text-white placeholder-white placeholder:opacity-50 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Enter a year"
                  />
                  <ErrorMessage
                    className=" text-red-700 mb-2 invalid-feedback"
                    name="date"
                    component="div"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full text-white">
                  <label htmlFor="fValue">Frontend Dev. Salary:</label>
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
                    className="mb-2 bg-gray-500 text-white placeholder-white placeholder:opacity-50 text-sm rounded-lg block w-full p-2.5  "
                    placeholder="Enter Frontend Dev. Salary"
                  />
                  <ErrorMessage
                    className=" text-red-700 mb-2 invalid-feedback"
                    name="fValue"
                    component="div"
                  />
                </div>

                <div className="flex flex-col gap-2 mb-5 w-full text-white">
                  <label htmlFor="bValue">Backend Dev. Salary:</label>
                  <Field
                    name="bValue"
                    id="bValue"
                    type="number"
                    variant="outlined"
                    value={formikProps.values.bValue}
                    onChange={formikProps.handleChange}
                    required
                    className="mb-2 bg-gray-500 text-white placeholder-white placeholder:opacity-50 text-sm rounded-lg block w-full p-2.5 "
                    placeholder="Enter Backend Dev. Salary"
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
                    className="bg-black rounded-xl my-2 py-1 px-4 w-full text-white"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => putData(formikProps.values)}
                    type="button"
                    className="bg-red-700 rounded-xl my-2 py-1 px-4 w-full text-white"
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
