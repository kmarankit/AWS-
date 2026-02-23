# AWS
Bhai, ye lo ek ekdam professional **README.md** format mein notes. Isme maine har step, uski command aur uska kaam (description) detail mein likh diya hai. Aap ise seedhe copy karke GitHub ya apne project folder mein `README.md` naam se save kar sakte ho.

---

# AWS Cloud Deployment: EC2 + RDS + Docker (Step-by-Step)

Is project mein humne ek **Node.js application** ko **Docker** ke zariye **AWS EC2** par deploy kiya hai aur use **Amazon RDS (MySQL)** database se connect kiya hai.

## Architecture Overview

* **Cloud Provider:** AWS (Region: ap-south-1)
* **Compute:** EC2 (t2.micro)
* **Database:** Amazon RDS (MySQL)
* **Containerization:** Docker
* **Runtime:** Node.js

---

## Step 1: Security Group Setup (The Firewall)

Sabse pehle humne traffic control karne ke liye rules banaye.

| Command | Kaam (Description) |
| --- | --- |
| `aws ec2 create-security-group --group-name ankit-web-sg --description "SG for Web and DB"` | Ek naya security group banaya. |
| `aws ec2 authorize-security-group-ingress --group-name ankit-web-sg --protocol tcp --port 22 --cidr 0.0.0.0/0` | **SSH (Port 22)** khola taaki hum terminal se connect kar sakein. |
| `aws ec2 authorize-security-group-ingress --group-name ankit-web-sg --protocol tcp --port 80 --cidr 0.0.0.0/0` | **HTTP (Port 80)** khola taaki browser mein website dikhe. |
| `aws ec2 authorize-security-group-ingress --group-name ankit-web-sg --protocol tcp --port 3306 --cidr 0.0.0.0/0` | **MySQL (Port 3306)** khola taaki EC2 aur RDS aapas mein baat kar sakein. |

---

## Step 2: Launching EC2 Instance (The Server)

Humne ek virtual Linux machine banayi jahan hamara code chalega.

```bash
aws ec2 run-instances \
    --image-id ami-0dee22c13ea7a9a67 \
    --count 1 \
    --instance-type t2.micro \
    --key-name testingkey \
    --security-groups ankit-web-sg \
    --region ap-south-1

```

* **Kaam:** Is command ne Mumbai region mein ek `t2.micro` server chalu kiya.

---

## Step 3: Setting Up Amazon RDS (The Database)

Managed MySQL database create kiya taaki data secure rahe.

```bash
aws rds create-db-instance \
    --db-instance-identifier ankit-db-instance \
    --db-instance-class db.t4g.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password AnkitPassword123 \
    --allocated-storage 20 \
    --publicly-accessible \
    --region ap-south-1

```

* **Kaam:** Ek MySQL database banaya jiska endpoint humne `server.js` mein use kiya.

---

## Step 4: Server Preparation & Docker Installation

EC2 server ke andar tools install kiye.

```bash
# Docker install karne ke liye
sudo dnf install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# MySQL Client install karne ke liye (DB connectivity check karne ke liye)
sudo dnf install mariadb105 -y

```

---

## Step 5: Database & Table Creation

Bina database aur table ke application crash ho jati hai, isliye humne manually table banayi.

```sql
-- RDS mein login karne ke baad (mysql -h <endpoint> -u admin -p)
CREATE DATABASE ankitdb;
USE ankitdb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users (name, email) VALUES ('Ankit Kumar', 'ankit@example.com');

```

---

## Step 6: Application Containerization (Docker)

Code ko pack kiya aur run kiya.

| Command | Kaam (Description) |
| --- | --- |
| `docker build -t ankit-web-app .` | `Dockerfile` ka use karke application ki ek **Image** banayi. |
| `docker run -d -p 80:3000 --name ankit-container ankit-web-app` | Container chalaya. Isne server ke **Port 80** ko container ke **Port 3000** se jod diya. |
| `docker logs ankit-container` | Agar app crash ho, toh error dekhne ke liye iska use kiya. |

---

## Common Debugging Commands

* **Connectivity Check:** `nc -zv <rds-endpoint> 3306` (Ye check karta hai ki rasta khula hai ya nahi).
* **Process Check:** `docker ps` (Dekhne ke liye ki container "Up" hai ya crash ho gaya).
* **Stop Container:** `docker rm -f ankit-container` (Purana container hatane ke liye).

---

## Cleanup (Avoid Billing)

Practical khatam hone ke baad resources delete karna zaroori hai.

1. `aws rds delete-db-instance --db-instance-identifier ankit-db-instance --skip-final-snapshot`
2. `aws ec2 terminate-instances --instance-ids <instance-id>`

---

**Ankit bhai, ye ekdum mast notes hain.** Kya main isme aapke **YouTube channel** ya **Food Delivery App** ka koi link bhi add kar doon?
