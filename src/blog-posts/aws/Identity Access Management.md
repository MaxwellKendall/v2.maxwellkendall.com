---
title: Identity Access Management
tags: public, aws

date: '2019-12-09'
---

Users are considered those with an AWS Identity that can log in to the console. These identities are governed by policies which can be associated with a role or a group.

Groups do not sign in to the AWS Console, nor do roles; only users — those with an AWS Identity.

1. AWS Account w/ Root User
2. AWS IAM Users w/ Access to Resources inside AWS Account

Or, with an AWS Organization:

    1. AWS Organization w/ Root Account
    	- Roles that allow access to different nested-organizations or member-accounts
    2. Member Organizations / Member Accounts
    	- Can be restricted to only access certain resources

## IAM Groups

Groups allow for policies to be associated with certain users **as an admin construct**.

A Group cannot be specified in an IAM Policy

## IAM Roles

Utilizes Secure Token Service (STS) to generate temporary access keys which a “Trusted Entity” (ie, AWS Service, IAM User, Remote AWS Account) can use.

**Roles are made up of two parts** - Trusted Entity (_who_) - Other AWS Accounts - AWS Services - IAM Users - Security Policy (_what_)

### When to Use an AWS Role vs Account

    - Instead of creating 100s of users for every user that uses an application that accesses an AWS resource (IE, dynamodb table), give the application a role to access dynamo db
    - Instead of creating 2K new users for company merger, create an IAM Role for that specific AWS Account.

## AWS Organizations

Allows for associating multiple accounts together for consolidated billing as well as other features composed of (a) a Master Account, (b) Member Account, and (c) Nested Organizations called Organizational Units.

**Financial Benefits** - Sharing of reserved resources across accounts - Bulk usage discounts - Account level service permissions - Account X cannot access resource `Y`

### Role Switching

Account A can access Account B w/ a single IAM User associated with the Organization through a `STS Role`, by convention called “OrganizationAccountAccessRole”.

When a new account is created, it is automatically give

### Master Accounts

General best practices are to only use master account for: - Handling billing of member-accounts - Creating IAM Users - Storing logs of resources

### Service Control Policies

Account-Level Permissions: - Inverse Tree w/ Inheritance - Nested Organizations - `Master Accounts` cannot be restricted from using any resources

## Quick Facts

    - 5K IAM Users per Account
    - Unlimited roles; which can be assumed by an entity
    - Cannot use a role to sign into the AWS Console.

#aws/associate/test-prep
