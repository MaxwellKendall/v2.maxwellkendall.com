---
title: Neworking Basics for AWS Fundamentals
tags: public, aws

date: '2019-12-09'
---

A basic understanding of networking is helpful for understanding AWS. This covers the basics of how devices can communicate with one another.

## The Seven Layers of an Open Systems Interconnection (OSI) Network

Each layer is encapsulated. It doesn’t know anything about what the other layers have done to the data, it just has it’s own responsibility.

1. Physical
   This is the electrical level of what happens. Transmissions are made between devices typically using radio frequency. What happens at this layer is considered analogous to people shouting in a dark room; transmissions are being made, but how communication occurs is handled at the next level.

2. Data Link
   Adds IDs (called MAC Addresses) assigned to each physical device. Provides a frame for each transmission:

```json
src: MAC_ADDRESS
destination: MAC_ADDRESS
```

3. Network
   Adds IP Addresses which allowing for communication outside of a devices immediate network.

4. Transport
   Adds segmentation to data from transmission; either via TCP (prioritizing reliability) or UDP (prioritizing speed). TCP specifies (A) orders the messages being sent and (B) the ports two devices should use for transmission / communication. Also error correction occurs here.

5. Session
   Adds state to transmission so request traffic and reply traffic are treated as part of the same transmission.

6. Presentation
   Adds encryption, compression, data-conversion and other standards for next layer

7. Application
   Adds protocols like HTTP, SSH, and FTP. For instance, HTTPS is just an HTTP connection running on a TLS connection provided by Layer 6.

**Example:**

- Type in url to browser, browser hits DNS which returns an IP address for destination
  - Layer 7: uses HTTP protocol
  - Layer 6: Data from HTTP protocol is encrypted (not understood)
  - Layer 5: Encrypted Data is recognized as outgoing traffic; creates session and looks for associated response traffic
  - Layer 4: Doesn’t know at all about session but segments data from request using TCP/UDP, adding order and error correction to data
  - Layer 3: Receives the segments of data and passes them, ultimately, to the destination IP
  - Layer 2: Frames data, sends it to another network device
  - Layer 1: Takes frame, puts it in binary/electrical parsing format

## Routing Policies

AWS’ DNS is provided by their Route53 Service. We can select different Routing Policies which allows us to control which Load Balancer
or subnet is exposed to traffic.

## Elastic Network Interface (ENI) and IP Addresses

When configuring EC2 instances, we can assign different kinds of IPs; public or private.

- A _private_ IP is static. It doesn’t change on reboot etc
- A _public_ IP is dynamic. It changes on reboot

Also, EC2 instances are natively private when using IPv4. Therefore, properly speaking, you cannot assign a public IP address to an EC2 Instance. If a public IP is assigned to an Instance, it is done so using an internet gateway which uses a process called Network Address Translation (NAT).

NAT takes the public DNS or public IP associated with an instance and translates it to the private IP and vice versa; it takes a private IP and resolves it with the public IP.
