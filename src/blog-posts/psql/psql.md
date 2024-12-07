---
title: PostgreSQL DB
tags: public, backend

date: '2020-08-27'
---

PostgreSQL is a popular relational database. This post will focus on the parts of SQL which I don't understand very well or have little to no experience.

## What are Indexes?

An index is similar to a Chapter in a book. It organizes a table. The name of the index gives an idea of what criteria is used to organize it; for example, birth-date might organize a users table by their birthday.
This would provide a more performant way to query the users table on a certain attribute. However, if a table is very big and requires common inserts it can have the opposite effect.

```
    create index birth-date on users (birthday)
```
