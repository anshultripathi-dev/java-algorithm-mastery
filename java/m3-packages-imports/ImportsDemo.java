// A package statement (if any) must be the FIRST line:  package com.example.demo;
// This file is in the default package, so there is none.

import java.util.ArrayList;                // import one class
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import static java.lang.Math.max;          // static import: use max(...) without "Math."

public class ImportsDemo {
    public static void main(String[] args) {
        // java.lang is imported automatically: String, Math, System, Integer ...
        List<String> names = new ArrayList<>();
        names.add("Asha");
        Map<String, Integer> ages = new HashMap<>();
        ages.put("Asha", 20);

        // a fully qualified name needs no import (useful when two classes share a simple name)
        java.util.Date now = null;
        java.sql.Date sqlDate = null;

        System.out.println(names + " " + ages + " max=" + max(3, 9));
        System.out.println(now == null && sqlDate == null);
        System.out.println(ImportsDemo.class.getName() + " in package '" + ImportsDemo.class.getPackageName() + "'");
    }
}
