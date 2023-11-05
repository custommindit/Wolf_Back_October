#! /usr/bin/bash
typeset -i avg
typeset -i len

read -a  arr

len=${#arr[@]};


echo $len
for i in ${arr[@]}
do 
    let avg+=$i
done

echo $(( avg / len  ))