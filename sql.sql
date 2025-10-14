CREATE TABLE Student( s_id varchar(20) comment '学生编号', s_name varchar(20) not null default '' comment '学生姓名', s_birth varchar(20) not null default '' comment '出生年月', s_sex varchar(10) not null default '' comment '学生性别', primary key(s_id) ) engine = InnoDB default charset = utf8 comment = '学生表';

CREATE TABLE Course( c_id varchar(20) comment '课程编号', c_name varchar(20) not null default '' comment '课程名称', t_id varchar(20) not null comment '教师编号', primary key(c_id) ) engine = InnoDB default charset = utf8 comment = '课程表';

CREATE TABLE Teacher( t_id varchar(20) comment '教师编号', t_name varchar(20) not null default '' comment '教师姓名', primary key(t_id) ) engine = InnoDB default charset = utf8 comment = '教师表';

CREATE TABLE Score( s_id varchar(20) comment '学生编号', c_id varchar(20) comment '课程编号', s_score INT(3) comment '分数', primary key(s_id, c_id) ) engine = InnoDB default charset = utf8 comment = '成绩表';
-- 插入学生表测试数据 
INSERT INTO Student values ('01', '赵雷', '1990-01-01', '男');
INSERT INTO Student values ('02', '钱电', '1990-12-21', '男');
INSERT INTO Student values ('03', '孙风', '1990-05-20', '男');
INSERT INTO Student values ('04', '李云', '1990-08-06', '男');
INSERT INTO Student values ('05', '周梅', '1991-12-01', '女');
INSERT INTO Student values ('06', '吴兰', '1992-03-01', '女');
INSERT INTO Student values ('07', '郑竹', '1989-07-01', '女');
INSERT INTO Student values ('08', '王菊', '1990-01-20', '女');
-- 课程表测试数据 
INSERT INTO Course values ('01', '语文', '02');
INSERT INTO Course values ('02', '数学', '01');
INSERT INTO Course values ('03', '英语', '03');
-- 教师表测试数据 
INSERT INTO Teacher values ('01', '张三');
INSERT INTO Teacher values ('02', '李四');
INSERT INTO Teacher values ('03', '王五');
-- 成绩表测试数据 
INSERT INTO Score values ('01', '01', 80);
INSERT INTO Score values ('01', '02', 90);
INSERT INTO Score values ('01', '03', 99);
INSERT INTO Score values ('02', '01', 70);
INSERT INTO Score values ('02', '02', 60);
INSERT INTO Score values ('02', '03', 80);
INSERT INTO Score values ('03', '01', 80);
INSERT INTO Score values ('03', '02', 80);
-- 查询"01"课程比"02"课程成绩高的学生的信息及课程分数 
SELECT  a.*
       ,b.s_score AS score1
FROM Student a
LEFT JOIN Score b
ON a.s_id = b.s_id AND b.c_id = '01'
LEFT JOIN Score c
ON a.s_id = c.s_id AND ( c.c_id = '02' or c.c_id = null )
WHERE b.s_score > c.s_score;
-- 查询"01"课程比"02"课程成绩低的学生的信息及课程分数 
SELECT  a.*
       ,b.s_score AS score1
FROM Student a
LEFT JOIN Score b
ON a.s_id = b.s_id AND ( b.c_id = '01' or b.c_id = null )
LEFT JOIN Score c
ON a.s_id = c.s_id AND c.c_id = '02'
WHERE b.s_score < c.s_score;
-- 查询平均成绩大于等于60分的同学的学生编号和学生姓名和平均成绩 
SELECT  a.s_id
       ,a.s_name
       ,ROUND(AVG(b.s_score),1) AS 平均成绩
FROM Student a
LEFT JOIN Score b
ON a.s_id = b.s_id
GROUP BY  a.s_id
HAVING AVG(b.s_score) >= 60;
-- 查询平均成绩小于60分的同学的学生编号和学生姓名和平均成绩(包括有成绩的和无成绩的) 
SELECT  a.s_id
       ,a.s_name
       ,ROUND(AVG(b.s_score),1) AS 平均成绩
FROM Student a
LEFT JOIN Score b
ON a.s_id = b.s_id
GROUP BY  a.s_id
HAVING AVG(b.s_score) <= 60 or AVG(b.s_score) = null;
-- 查询所有同学的学生编号、学生姓名、选课总数、所有课程的总成绩, 并从高到低排序 
SELECT  a.s_id
       ,a.s_name
       ,COUNT(b.c_id)  AS 选课总数
       ,SUM(b.s_score) AS 总成绩
FROM Student a
LEFT JOIN Score b
ON a.s_id = b.s_id
GROUP BY  a.s_id ASC;
-- 查询各学生的年龄 
SELECT  s_id
       ,s_birth
       ,( DATE_FORMAT(NOW(),'%Y') - DATE_FORMAT(s_birth,'%Y') ) - ( CASE WHEN DATE_FORMAT(NOW(),'%m%d') < DATE_FORMAT(s_birth,'%m%d') THEN 1 ELSE 0 END ) AS age
FROM Student;
-- 查询学过"张三"老师授课的同学的信息 
SELECT  *
FROM Student
WHERE s_id IN ( SELECT s_id FROM Score WHERE c_id = ( SELECT c_id FROM Course WHERE t_id = ( SELECT t_id FROM Teacher WHERE t_name = '张三' ) ) );
-- 查询每门功课成绩最好的前两名 
SELECT  *
FROM
(
	SELECT  a.s_id
	       ,a.s_score
	       ,@i := @i + 1 AS 排名
	FROM Score a,
	(
		SELECT  @i := 0
	) b
	WHERE a.c_id = '01'
	ORDER BY a.s_score DESC 
) c
WHERE 排名 BETWEEN 1 AND 2 
UNION ALL
SELECT  *
FROM
(
	SELECT  a.s_id
	       ,a.s_score
	       ,@j := @j + 1 AS 排名
	FROM Score a,
	(
		SELECT  @j := 0
	) b
	WHERE a.c_id = '02'
	ORDER BY a.s_score DESC 
) c
WHERE 排名 BETWEEN 1 AND 2 
UNION ALL
SELECT  *
FROM
(
	SELECT  a.s_id
	       ,a.s_score
	       ,@k := @k + 1 AS 排名
	FROM Score a,
	(
		SELECT  @k := 0
	) b
	WHERE a.c_id = '03'
	ORDER BY a.s_score DESC 
) c
WHERE 排名 BETWEEN 1 AND 2;
-- 查询学过编号为"01"并且也学过编号为"02"的课程的同学的信息, 及两门课程成绩 
SELECT  a.*
       ,b.s_score
       ,c.s_score
FROM Student a
LEFT JOIN Score b
ON a.s_id = b.s_id AND b.c_id = '01'
LEFT JOIN Score c
ON a.s_id = c.s_id AND c.c_id = '02';
-- 查询学过编号为"01"但是没有学过编号为"02"的课程的同学的信息 
SELECT  *
FROM Student a
WHERE a.s_id IN ( SELECT s_id FROM Score WHERE c_id = '01' )
AND a.s_id NOT IN ( SELECT s_id FROM Score WHERE c_id = '02' );

SELECT  a.*
       ,b.*
       ,c.*
FROM Student a
INNER JOIN Score b
ON a.s_id = b.s_id AND b.c_id = '01' -- 确保选了01课 
LEFT JOIN Score c
ON a.s_id = c.s_id AND c.c_id = '02' -- 尝试连接02课 
WHERE c.s_id IS NULL;
-- 如果连接02课失败，则c.s_id为NULL，说明没选02课
-- 查询没有学全所有课程的同学的信息 
SELECT  a.*
FROM Student a
WHERE a.s_id NOT IN ( SELECT c.s_id FROM Score c JOIN Score d ON c.s_id = d.s_id AND d.c_id = '02' JOIN Score e ON c.s_id = e.s_id AND e.c_id = '03' WHERE c.c_id = '01' );

SELECT  *
FROM Student d
WHERE d.s_id IN (
SELECT  e.s_id
FROM Student e
WHERE e.s_id NOT IN (
SELECT  a.s_id
FROM Score a
JOIN Score b
ON a.s_id = b.s_id AND b.c_id = '02'
JOIN Score c
ON a.s_id = c.s_id AND c.c_id = '03'
WHERE a.c_id = '01' ) );
-- 查询至少有一门课与学号为"01"的同学所学相同的同学的信息
-- 至少有一个反面就是全都没有
-- 查询1号同学学了什么课程 
SELECT  b.c_id
FROM Student a
JOIN Score b
ON a.s_id = b.s_id
WHERE a.s_id = '01';
-- 查询每名学生的课程 
SELECT  *
FROM Student a
JOIN Score b
ON a.s_id = b.s_id;
-- 查询至少有一门课的学生 
SELECT  a.s_id
       ,b.c_id
       ,c.c_id
       ,d.c_id
FROM Student a
JOIN Score b
ON a.s_id = b.s_id
JOIN Score c
ON a.s_id = c.s_id
JOIN Score d
ON a.s_id = d.s_id
WHERE d.c_id is not null or b.c_id is not null or c.c_id is not null;
-- 查询至少有一门课与01相同的同学 
SELECT  distinct b.s_id
FROM Score b
WHERE b.c_id IN ( SELECT b.c_id FROM Student a JOIN Score b ON a.s_id = b.s_id WHERE a.s_id = '01' );

SELECT  *
FROM Student c
WHERE c.s_id IN (
SELECT  distinct b.s_id
FROM Score b
WHERE b.c_id IN (
SELECT  b.c_id
FROM Student a
JOIN Score b
ON a.s_id = b.s_id
WHERE a.s_id = '01' ) );
-- 查询和"01"号的同学学习的课程完全相同的其他同学的信息 
SELECT  * FROM Student d
    WHERE s_id IN (
        SELECT  c.s_id FROM Score c
        WHERE s_id != '01'
        AND c.c_id IN (
            SELECT  b.c_id FROM Student a
            JOIN Score b ON a.s_id = b.s_id
            WHERE a.s_id = '01' )
            GROUP BY  c.s_id
            HAVING COUNT(1) = (SELECT COUNT(1) FROM Score WHERE s_id = '01' )
    );

-- 查询两门及其以上不及格课程的同学的学号，姓名及其平均成绩
SELECT a.s_name,a.s_id,AVG(b.s_score) FROM Student a
LEFT JOIN Score b on a.s_id = b.s_id
GROUP by a.s_id
HAVING a.s_id in (
    SELECT c.s_id from Score c
    where c.s_score < 60
    GROUP by c.s_id
    HAVING COUNT(1) >=2
);

-- 检索"01"课程分数小于60，按分数降序排列的学生信息及01分数
SELECT a.*,b.s_score as fenshu from Student a
LEFT JOIN Score b on a.s_id = b.s_id
where b.s_id = '01' and b.s_score <= 60 
ORDER by b.s_score DESC;

-- 按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩
SELECT a.s_id,b.s_score,c.s_score,d.s_score,AVG(a.s_score) as ii
from Score a
LEFT JOIN Score b on a.s_id = b.s_id and b.c_id = '01'
LEFT JOIN Score c on a.s_id = c.s_id and c.c_id = '02'
LEFT JOIN Score d on a.s_id = d.s_id and d.c_id = '03'
GROUP by a.s_id;
ORDER by ii DESC

-- 查询各科成绩最高分、最低分和平均分：以如下形式显示：课程ID，课程name，最高分，最低分，平均分，及格率，中等率，优良率，优秀率
SELECT 
       b.c_id as 课程ID,
       b.c_name as 课程name, 
       max(a.s_score) as 最高分,
       MIN(a.s_score) as 最低分, 
       AVG(a.s_score) as 平均分,
       ROUND(100 * (sum(case when a.s_score >= 60 then 1 else 0 end) / COUNT(1)),2) as 及格率,
       ROUND(100 * (sum(case when a.s_score >= 70 and a.s_score < 80 then 1 else 0 end)) / COUNT(1),2) as 中等率,
       ROUND(100 * (sum(case when a.s_score >= 80 and a.s_score < 90 then 1 else 0 end)) / COUNT(1),2) as 优良率,
       ROUND(100 * (sum(case when a.s_score >= 90 then 1 else 0 end) / count(1)),2) as 优秀率
from 
       Score a
left JOIN Course b on a.c_id = b.c_id
GROUP by b.c_id;


-- 按各科成绩进行排序，并显示排名（mysql没有rank顺序函数）
SELECT * from (
       SELECT
       a.c_id,
       b.c_name,
       a.s_score,
       @i := @i + 1 as 排名
from
       Score a
join (SELECT @i := 0) c
left join Course b on a.c_id = b.c_id
where a.c_id = '01'
ORDER by a.s_score DESC
) as tab1
UNION ALL
SELECT * from (
SELECT
       a.c_id,
       b.c_name,
       a.s_score,
       @j := @j + 1 as 排名
from
       Score a
join (SELECT @j := 0) c
left join Course b on a.c_id = b.c_id
where a.c_id = '02'
ORDER by a.s_score DESC
) as tab2

UNION all
SELECT * from (
SELECT
       a.c_id,
       b.c_name,
       a.s_score,
       @k := @k + 1 as 排名
from
       Score a
join (SELECT @k := 0) c
left join Course b on a.c_id = b.c_id
where a.c_id = '03'
ORDER by a.s_score DESC
) as tab3;

-- 查询学生的总成绩并进行排名
select 
       a.s_id,
       c.s_name,
       sum(s_score) as 总分,
       @i := @i + 1 as 排名
from 
       Score a
join (SELECT @i := 0) b
join Student c on a.s_id = c.s_id 
GROUP by s_id
ORDER by 总分 DESC;
 

-- 查询不同老师所教不同课程平均分从高到低显示
select
       a.c_id,
       b.c_name,
       c.t_name,
       AVG(s_score)
from
       Score a
join Course b on a.c_id = b.c_id
join Teacher c on b.t_id = c.t_id
GROUP by a.c_id
ORDER by AVG(s_score) DESC;

-- 查询所有课程的成绩第2名到第3名的学生信息及该课程成绩
select * from (
       select
              a.*,
              b.s_score,
              @i := @i + 1 as 排名
       from
              Student a
       join (select @i := 0) c
       left join Score b on a.s_id = b.s_id
       where b.c_id = '01'
       order by b.s_score DESC
) q
where 排名 BETWEEN 2 and 3
UNION all 
select * from (
       select
              a.*,
              b.s_score,
              @j := @j + 1 as 排名
       from
              Student a
       join (select @j := 0) c
       left join Score b on a.s_id = b.s_id
       where b.c_id = '02'
       order by b.s_score DESC
) w
where 排名 BETWEEN 2 and 3
UNION all 
select * from (
       select
              a.*,
              b.s_score,
              @k := @k + 1 as 排名
       from
              Student a
       join (select @k := 0) c
       left join Score b on a.s_id = b.s_id
       where b.c_id = '03'
       order by b.s_score DESC
) e
where 排名 BETWEEN 2 and 3

-- 统计各科成绩各分数段人数：课程编号,课程名称,[100-85],[85-70],[70-60],[0-60]及所占百分比
select
       a.c_id,
       b.c_name,
       sum(case when a.s_score >= 85 and a.s_score <= 100 then 1 else 0 end ) as '[100 - 85]',
       ROUND(100 * (sum(case when a.s_score > 85 and a.s_score <= 100 then 1 else 0 end )) / count(1),2) as per,
       sum(case when a.s_score >= 75 and a.s_score < 85 then 1 else 0 end ) as '[85 - 70]',
       ROUND(100 * (sum(case when a.s_score > 75 and a.s_score <= 85 then 1 else 0 end )) / count(1),2) as per2,
       sum(case when a.s_score >= 65 and a.s_score < 70 then 1 else 0 end ) as '[70 -60]',
       ROUND(100 * (sum(case when a.s_score >= 60 and a.s_score < 75 then 1 else 0 end )) / count(1),2) as per3,
       sum(case when a.s_score >= 0 and a.s_score < 60 then 1 else 0 end ) as '[0-60]',
       ROUND(100 * (sum(case when a.s_score >= 0 and a.s_score < 60 then 1 else 0 end )) / count(1),2) as per4
from
       Score a
join Course b on a.c_id = b.c_id
GROUP by a.c_id;

-- 查询学生平均成绩及其名次
SELECT
    b.s_id,
    @i:=@i+1 AS 相同分数的不同名次,
    @k:=(CASE WHEN @avg_s=b.avg_score THEN @k ELSE @i END) AS 相同分数的相同名次,
    @avg_s:=b.avg_score AS 平均成绩
FROM
(SELECT
    a.s_id,
    ROUND(AVG(a.s_score), 2) AS avg_score
FROM
    Score a
GROUP BY
    a.s_id
ORDER BY AVG(a.s_score) DESC) b,(SELECT @i:=0,@avg_s:=0,@k:=0) c

-- 查询出只有两门课程的全部学生的学号和姓名
select
       a.s_id,
       b.s_name
from
       Score a
join Student b on a.s_id = b.s_id
GROUP by a.s_id
HAVING count(1) = 2;


-- 查询同名同性学生名单，并统计同名人数
SELECT a.s_name,a.s_sex,COUNT(1) AS 人数 FROM Student a 
JOIN Student b ON a.s_name=b.s_name AND a.s_sex=b.s_sex AND a.s_id!=b.s_id
GROUP BY a.s_name,a.s_sex;


-- 查询每门课程的平均成绩，结果按平均成绩降序排列，平均成绩相同时，按课程编号升序排列
SELECT c_id,ROUND(avg(s_score),2)FROM score 
GROUP BY c_id
ORDER BY avg(s_score) DESC,c_id ASC 

-- 查询课程名称为"数学"，且分数低于60的学生姓名和分数
select
       c.s_name,
       a.s_score
from
       Score a
join Student c on a.s_id = c.s_id
join Course b on a.c_id = b.c_id
where  a.s_score <= 60 and b.c_name = '数学' ;

-- 查询所有学生的课程及分数情况
select
       *
from
       Course a
join Score b on a.c_id = b.c_id
join Student c on b.s_id = c.s_id;


-- 查询不及格的学生id,姓名，及其课程名称，分数
SELECT a.s_id,a.s_name,c.c_name,b.s_score FROM Student a 
LEFT JOIN Score b ON a.s_id=b.s_id
LEFT JOIN Course c ON b.c_id=c.c_id
WHERE b.s_score < 60

-- 查询选修"张三"老师所授课程的学生中，成绩最高的学生信息及其成绩

select
       a.*,
       b.s_score
from
       Student a
join Score b on a.s_id = b.s_id
where a.s_id = (
       select s_id  from Score 
       where c_id = (
              select c_id from Teacher s  
              join Course r on s.t_id = r.t_id
              where t_name = '张三'
       )
       order by s_score DESC
       limit 1
);

| employee_id | employee_name | manager_id | salary | department  | employee_id | employee_name | manager_id | salary | department  |
| ----------- | ------------- | ---------- | ------ | ----------- | ----------- | ------------- | ---------- | ------ | ----------- |
| 1           | Alice         | null       | 12000  | Executive   | null        | null          | null       | null   | null        |
| 2           | Bob           | 1          | 10000  | Sales       | 1           | Alice         | null       | 12000  | Executive   |
| 3           | Charlie       | 1          | 10000  | Engineering | 1           | Alice         | null       | 12000  | Executive   |
| 4           | David         | 2          | 7500   | Sales       | 2           | Bob           | 1          | 10000  | Sales       |
| 5           | Eva           | 2          | 7500   | Sales       | 2           | Bob           | 1          | 10000  | Sales       |
| 6           | Frank         | 3          | 9000   | Engineering | 3           | Charlie       | 1          | 10000  | Engineering |
| 7           | Grace         | 3          | 8500   | Engineering | 3           | Charlie       | 1          | 10000  | Engineering |
| 8           | Hank          | 4          | 6000   | Sales       | 4           | David         | 2          | 7500   | Sales       |
| 9           | Ivy           | 6          | 7000   | Engineering | 6           | Frank         | 3          | 9000   | Engineering |
| 10          | Judy          | 6          | 7000   | Engineering | 6           | Frank         | 3          | 9000   | Engineering |


| employee_id | subsident_id | salary |
| ----------- | ------------ | ------ |
| 1           | 1            | 12000  |
| 2           | 2            | 10000  |
| 3           | 3            | 10000  |
| 4           | 4            | 7500   |
| 5           | 5            | 7500   |
| 6           | 6            | 9000   |
| 7           | 7            | 8500   |
| 8           | 8            | 6000   |
| 9           | 9            | 7000   |
| 10          | 10           | 7000   |
| 1           | 2            | 10000  |
| 1           | 3            | 10000  |
| 2           | 4            | 7500   |
| 2           | 5            | 7500   |
| 3           | 6            | 9000   |
| 3           | 7            | 8500   |
| 4           | 8            | 6000   |
| 6           | 9            | 7000   |
| 6           | 10           | 7000   |
| 1           | 4            | 7500   |
| 1           | 5            | 7500   |
| 1           | 6            | 9000   |
| 1           | 7            | 8500   |
| 2           | 8            | 6000   |
| 3           | 9            | 7000   |
| 3           | 10           | 7000   |
| 1           | 8            | 6000   |
| 1           | 9            | 7000   |
| 1           | 10           | 7000   |

| sale_id | product_id | sale_date  | quantity | price | total_revenue | category | season |
| ------- | ---------- | ---------- | -------- | ----- | ------------- | -------- | ------ |
| 1       | 1          | 2023-01-15 | 5        | 10    | 50            | Apparel  | Winter |
| 2       | 2          | 2023-01-20 | 4        | 15    | 60            | Apparel  | Winter |
| 3       | 3          | 2023-03-10 | 3        | 18    | 54            | Kitchen  | Spring |
| 4       | 4          | 2023-04-05 | 1        | 20    | 20            | Tech     | Spring |
| 5       | 1          | 2023-05-20 | 2        | 10    | 20            | Apparel  | Spring |
| 6       | 2          | 2023-06-12 | 4        | 15    | 60            | Apparel  | Summer |
| 7       | 5          | 2023-06-15 | 5        | 12    | 60            | Fitness  | Summer |
| 8       | 3          | 2023-07-24 | 2        | 18    | 36            | Kitchen  | Summer |
| 9       | 4          | 2023-08-01 | 5        | 20    | 100           | Tech     | Summer |
| 10      | 5          | 2023-09-03 | 3        | 12    | 36            | Fitness  | Fall   |
| 11      | 1          | 2023-09-25 | 6        | 10    | 60            | Apparel  | Fall   |
| 12      | 2          | 2023-11-10 | 4        | 15    | 60            | Apparel  | Fall   |
| 13      | 3          | 2023-12-05 | 6        | 18    | 108           | Kitchen  | Winter |
| 14      | 4          | 2023-12-22 | 3        | 20    | 60            | Tech     | Winter |
| 15      | 5          | 2024-02-14 | 2        | 12    | 24            | Fitness  | Winter |

| sale_id | product_id | sale_date  | quantity | price  | total_revenue | category    | season |
| ------- | ---------- | ---------- | -------- | ------ | ------------- | ----------- | ------ |
| 1       | 10         | 2023-11-30 | 1        | 77.98  | 77.98         | Fitness     | Fall   |
| 3       | 4          | 2023-09-04 | 7        | 73.66  | 515.62        | Fitness     | Fall   |
| 8       | 1          | 2023-10-05 | 6        | 12.29  | 73.74         | Books       | Fall   |
| 9       | 9          | 2023-10-27 | 9        | 46.78  | 421.02        | Garden      | Fall   |
| 10      | 3          | 2023-09-29 | 1        | 48.43  | 48.43         | Garden      | Fall   |
| 13      | 5          | 2023-10-19 | 10       | 33.78  | 337.8         | Books       | Fall   |
| 14      | 2          | 2023-11-14 | 7        | 148.61 | 1040.27       | Tech        | Fall   |
| 15      | 10         | 2023-10-17 | 6        | 75.76  | 454.56        | Fitness     | Fall   |
| 19      | 2          | 2023-10-16 | 2        | 130.65 | 261.3         | Tech        | Fall   |
| 20      | 5          | 2023-09-17 | 3        | 47.33  | 141.99        | Books       | Fall   |
| 27      | 4          | 2023-11-06 | 6        | 28.23  | 169.38        | Fitness     | Fall   |
| 28      | 14         | 2023-11-21 | 5        | 125.81 | 629.05        | Electronics | Fall   |
| 38      | 14         | 2023-10-14 | 7        | 196.08 | 1372.56       | Electronics | Fall   |