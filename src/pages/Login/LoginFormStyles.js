import styled from 'styled-components';

export const FormContainer = styled.div`
    background-color: #f9f9f9;
    width: 100%;
    margin: 100px auto 0;
    max-width: 360px;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

export const FormGroup = styled.div`
    margin-bottom: 25px;
    text-align: left;

    label {
        display: block;
        margin-bottom: 8px;
        color: #555;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 6px;
        transition: border-color 0.3s ease;

        &:focus {
            outline: none;
            border-color: #007bff;
        }
    }
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 18px;
    color: #ffffff;
    background-color: #007bff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

export const FormTitle = styled.h2`
    margin-bottom: 25px;
    color: #333;
    font-size: 28px;
    font-weight: bold;
`;

export const FormFooter = styled.div`
    margin-top: 20px;
    font-size: 14px;
    color: #666;

    a {
        color: #007bff;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: #0056b3;
        }
    }
`;

export const BackButton = styled.button`
    background: none;
    border: none;
    color: #007BFF;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 16px;

    &:hover {
        text-decoration: underline;
    }
`;
