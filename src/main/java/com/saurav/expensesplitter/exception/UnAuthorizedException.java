package com.saurav.expensesplitter.exception;

public class UnAuthorizedException extends RuntimeException{

    public UnAuthorizedException(String message){
        super(message);
    }
}

