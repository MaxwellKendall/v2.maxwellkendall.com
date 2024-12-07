---
title: Cloud Formation
tags: public, aws

date: '2019-12-09'
---

Infrastructure as Code. Ballin.

## Configuration Object

yaml or JSON

Required Key: `resources`

Example:

```json
{
  "resources": {
    "cat-pics": {
      "Type": "AWS::S3::Bucket"
    }
  }
}
```

The first key, `cat-pics` is considered a logical resource which creates what’s known as a _stack_. A stack is a physical resource, in this case an S3 Bucket, derived from a template.
