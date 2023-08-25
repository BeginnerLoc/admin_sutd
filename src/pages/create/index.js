import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker, Upload } from 'antd';
import CustomSideBar from '../../../components/CustomSideBar';
import {
  InboxOutlined
} from '@ant-design/icons';
import axios from 'axios';


// const data = [
//   {
//     key: '1',
//     moduleCode: 'John Brown',
//     questionNo: 32,
//     created: '05/03/2023',
//     deadline: '12/03/2023',
//     status: ['current'],
//   },
//   {
//     key: '2',
//     moduleCode: 'Jim Green',
//     questionNo: 42,
//     created: '05/03/2023',
//     deadline: '12/03/2023',
//     status: ['current'],
//   },
//   {
//     key: '3',
//     moduleCode: 'Joe Black',
//     questionNo: 32,
//     created: '05/03/2023',
//     deadline: '12/03/2023',
//     status: ['past'],
//   },
// ];

const Create = () => {

  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    // Fetch the API data
    axios.get('https://sutd-bot-server.azurewebsites.net/api/admin/get_all_questions')
      .then(response => {
        // Extract the data from the response
        const responseData = response.data;

        // Update the component state with the response data
        setResponseData(responseData);
        console.log(responseData)
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error("Error occurred:", error);
      });
  }, []);


  const columns = [
    {
      title: 'Module Code',
      dataIndex: 'module_code',
      key: 'module_code',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Question Number',
      dataIndex: 'question_no',
      key: 'question_no',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'No of Submissions',
      dataIndex: 'no_submisison',
      key: 'no_submisison',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <>
          {status.map((status) => {
            let color = 'green';
            if (status === 'past') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={status}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, action) => (
        <Space size="middle">
          <Button type='primary'>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {

      form.submit();
    });
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const { Dragger } = Upload;

  const onFinish = async (values) => {

    // Construct the URL using template literals
    const url = `http://localhost:8000/api/admin/1/create_question/${values.moduleCode}/${values.questionNumber}`;

    const formData = new FormData();

    const fileList = values.answerSample;
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj;
      formData.append('file', file);
    }

    try {
      // Make a POST request using Axios with formData
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('POST request successful:', response.data);
      // Handle the response as needed
    } catch (error) {
      console.log("Error")
      console.log('Error while making POST request:', error);
      // Handle the error
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
  };

  const validateFile = (_, fileList) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const isValid = file.name.endsWith('.py');
      if (!isValid) {
        return Promise.reject(new Error('Please upload a file with a .py extension.'));
      }
    }
    return Promise.resolve();
  };

  return (
    <CustomSideBar>
      <Table columns={columns} dataSource={responseData} />
      <Button type="primary" style={{ position: 'relative', top: 0 }} onClick={showModal}>Create</Button>
      <Modal
        title="Create New Question"
        open={open}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="sampleForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Module Code"
            name="moduleCode"
            rules={[{ required: true, message: 'Please enter the module code.' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Question Number"
            name="questionNumber"
            rules={[{ required: true, message: 'Please enter the question number.' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'Please enter the question.' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Answer Sample"
            name="answerSample"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: true, message: 'Please upload an answer sample.' }, { validator: validateFile },]}
          >
            <Dragger multiple={false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: 'Please select a deadline.' }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </CustomSideBar>
  )
};



export default Create;
