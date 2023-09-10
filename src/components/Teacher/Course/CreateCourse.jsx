import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@emotion/react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import  storage  from '../../../firebase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import http from "../../../../Axios/axios";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
  const course = useLocation().state?.course
  const theme = useTheme()
  const navigate = useNavigate()
  const [image, setImage] = React.useState(null);
  const [user, setUser] = React.useState('')
  const [imageError, setImageError] = React.useState('')

  useEffect(()=>{
    if (course) {
      setImage(course.image);
    } else {
      setImage(null)
    }
  } , [course])


  const initialValues = course === undefined ? {
    courseCode: "",
    title: "",
    creditHours: "",
    description: "",
    language: "",
    starting: "",
    ending: "",
  } : {
    courseCode: course.courseCode,
    title: course.name,
    creditHours: course.creditHours,
    description: course.description,
    language: course.language,
    starting: dayjs(course.startingDate),
    ending: dayjs(course.endingDate),
  }

  const { values, handleBlur, handleChange, handleSubmit, errors, touched, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        courseCode: Yup.string().min(4).max(6).required("Please Enter the course Code"),
        title: Yup.string().min(3).max(25).required("Please Enter the course title"),
        creditHours: Yup.number().nullable(true).required("Credit Hours are required!"),
        language: Yup.string().ensure().required("Language is required required!"),
        description: Yup.string().min(5).max(100).required("Please Enter the course Description"),
        starting: Yup.date().required("Starting Date is required"),
        ending: Yup.date().required("Ending Date is required"),
      }),
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        console.log(values);
        action.resetForm();
      },
    });

  async function addCourse(downloadURL) {
    try {
      const newCourse = {
        teacher: user._id,
        courseCode: values.courseCode,
        name: values.title,
        description: values.description,
        creditHours: values.creditHours,
        language: values.language,
        startingDate: values.starting,
        endingDate: values.ending,
        image: downloadURL,
      };
      if (course === undefined)
      {
      const url = "/course/addCourse";
        const response = await http.post(url, newCourse);
        console.log("course added", response)
        return navigate("/Teacher/CoursesList");
      } 
      else {
      const url = "/course/updateCourse/" + course._id;
        const response = await http.patch(url, newCourse);
        console.log("course updated", response)
        return navigate("/Teacher/CoursesList");
      }
    } catch (e) {
      console.log(e);
    }
  }

  function getUser() {
    const user = localStorage.getItem("User");
    const p = JSON.parse(user);
    console.log(p)
    setUser(JSON.parse(user));
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if(image === null)
    return;
    setImageError('')
  }, [image]);

  const handleClick = () => {
    if(image === null){
      setImageError("Image is required!")
      return;
    }
    if (image === null || values.courseCode === '' || values.title === '' || values.creditHours === '' || values.description === '' || values.language === '' || values.starting === '' || values.ending === '')
      return;
    const imgRef = ref(storage, `courseImages/${image.name}`)
    const uploadTask = uploadBytesResumable(imgRef, image)
    uploadTask.on('state_changed', (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(progress)
    }, (error) => {
      console.log("error")
    }, () => {
      console.log("success!")
      getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
        addCourse(downloadURL)
        console.log(downloadURL)
      })
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',}}>
      <Box>
        <p style={{ fontWeight: 'bold', marginBottom: 20, marginTop: 1, fontSize:25 }}>Create New Course</p>
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: 2, paddingLeft: 5, paddingRight: 5,boxShadow: 'rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset'  }}>
            <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:33,padding:0, textAlign:'start', fontWeight:'bold'}}>Course Code*</p>
            <TextField sx={{  width: '100%', marginTop:2 }}
              id="outlined-multiline-flexible"
              label="Enter Course Code"
              color='secondary'
              name='courseCode'
              value={values.courseCode}
              onChange={handleChange}
              onBlur={handleBlur}
            />{errors.courseCode && touched.courseCode ? (
              <p style={{ color: 'red', marginTop: 0, marginLeft: 4, marginBottom: 0 }}>{errors.courseCode}</p>
            ) : null}
            <br />
            <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:3,padding:0, textAlign:'start', fontWeight:'bold'}}>Name*</p>
            <TextField sx={{  width: '100%', marginTop:2 }}
              id="outlined-multiline-flexible"
              label="Enter Course Name"
              color='secondary'
              name='title'
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}

            />{errors.title && touched.title ? (
              <p style={{ color: 'red', marginLeft: 4, marginBottom: 0, marginTop: 0 }}>{errors.title}</p>
            ) : null}
            <br />
            <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:3,padding:0, textAlign:'start', fontWeight:'bold'}}>Credit Hours*</p>
            <TextField sx={{  width: '100%', marginTop:2 }}
              id="outlined-number"
              label="Enter Credit Hours"
              type="number"
              color='secondary'
              name='creditHours'
              value={values.creditHours}
              onChange={handleChange}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />{errors.creditHours && touched.creditHours ? (
              <p style={{ color: 'red', marginTop: 0, marginLeft: 4, marginBottom: 0 }}>{errors.creditHours}</p>
            ) : null}
            <br />
            <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:3,padding:0, textAlign:'start', fontWeight:'bold'}}>Description*</p>
            <TextField sx={{  width: '100%', marginTop:2 }}
              id="outlined-multiline-flexible"
              label="Enter Course Description"
              color='secondary'
              multiline
              name='description'
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />{errors.description && touched.description ? (
              <p style={{ color: 'red', marginTop: 0, marginLeft: 4, marginBottom: 0 }}>{errors.description}</p>
            ) : null}
            <br />
            <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:3,padding:0, textAlign:'start', fontWeight:'bold'}}>Language*</p>
            <FormControl sx={{ marginTop: 2, width: '100%' }}>
              <InputLabel >Select Language</InputLabel>
              <Select
                id="outlined-multiline-flexible"
                label="Language"
                color='secondary'
                name='language'
                value={values.language}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value={"Java"}>Java</MenuItem>
                <MenuItem value={"C++"}>C++</MenuItem>
                <MenuItem value={"C Sharp"}>C# (sharp)</MenuItem>
                <MenuItem value={"C Language"}>C Language</MenuItem>
                <MenuItem value={"Masm"}>Assembly (MASM)</MenuItem>
                <MenuItem value={"Mips"}>Assembly (MIPS)</MenuItem>
                <MenuItem value={"Python"}>Python</MenuItem>
              </Select>
            </FormControl>
            {errors.language && touched.language ? (
              <p style={{ color: 'red', marginTop: 0, marginLeft: 4, marginBottom: 0 }}>{errors.language}</p>
            ) : null}
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{ width: '100%', marginTop: 0 }}>
                <Box>
                <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:0,padding:0, textAlign:'start', fontWeight:'bold'}}>Starting Date*</p>
                  <Box sx={{marginTop:2}}>
                    <DatePicker
                      name='starting'
                      id="starting"
                      value={values.starting}
                      onChange={(value) => setFieldValue("starting", value, true)}
                      onBlur={handleBlur}
                      label="Select Starting Date" />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {errors.starting && touched.starting ? (
                      <p style={{ color: 'red', marginTop: 0, marginLeft: 4, marginBottom: 0 }}>{errors.starting}</p>
                    ) : null}
                  </Box>
                </Box>
                <br />
                <Box>
                <p style={{display:'flex',flexDirection:'row',marginBottom:0,marginTop:0,padding:0, textAlign:'start', fontWeight:'bold'}}>Ending Date*</p>
                  <Box sx={{marginTop:2}}>
                    <DatePicker
                      name='ending'
                      id='ending'
                      value={values.ending}
                      onChange={(value) => setFieldValue("ending", value, true)}
                      onBlur={handleBlur}
                      label="Select Ending Date" />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {errors.ending && touched.ending ? (
                      <p style={{ color: 'red', marginTop: 0, marginLeft: 4, marginBottom: 0 }}>{errors.ending}</p>
                    ) : null}
                  </Box>
                </Box>
              </DemoContainer>
            </LocalizationProvider>
            <br />
            <Box sx={{  fontWeight: 'bold', width: '100%',marginTop:1 }} >
              <p style={{ fontWeight: 'bold',margin:0}}>Upload Picture* <Button variant="outlined" component="label" color='secondary' sx={{ width: '100%', padding: 1, borderStyle: 'dashed', borderRadius: 2 }}><Button variant="dashed" component="label" sx={{ color: '#999999' }}>
                Click to browse or <br />
                Drag and Drop Files
                <input name='image' onChange={(e) => { setImage(e.target.files[0]) }} hidden accept="image/*" multiple type="file" />
              </Button></Button></p>
             <p style={{ color: 'red', fontWeight: 'normal', marginTop: 0, marginLeft: 4, marginBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>{imageError}</p>
            </Box>

            <Box sx={{ width: '100%', marginBottom: 5, marginTop: 4 }}>
              <Button type='submit' onClick={() => { handleClick() }}
                variant="contained" color="secondary" endIcon={<ImportContactsIcon fontSize='large' />} sx={{ width: '100%', padding: 2, fontSize: 16, fontWeight: 'bold',borderRadius: 2 }}>
                {course === undefined ? 'Create Course' : 'Update Course'}
              </Button>
            </Box>
          </Box>
        </form>

      </Box>
    </Box>
  );
}

export default CreateCourse;
