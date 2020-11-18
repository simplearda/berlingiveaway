const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("ms");

exports.run = async (client, message, args) => {
     if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Bu Komutu Kullanabilmek İçin **YÖNETİCİ** Yetkisine Sahip Olman Gerek.")
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}
  
      function cekme(message, array) {
      var eskikazananlar = db.fetch(`cekilis_${message.id}.kazananlar`) || []
      var cekilenkisi = array[Math.floor(Math.random() * array.length)]
      if (!client.users.cache.get(cekilenkisi.id)) {
        return cekme(message, array)
      }
      if (cekilenkisi.id == client.user.id) {
        return cekme(message, array)
      }
      while (eskikazananlar.includes(cekilenkisi.id)) {
        return cekme(message, array)
      }
      if (!eskikazananlar.includes(cekilenkisi.id)) {
        if (db.has(`cekilis_${message.id}.kazananlar`)) {
          db.push(`cekilis_${message.id}.kazananlar`, cekilenkisi.id)
        }else{
          db.set(`cekilis_${message.id}.kazananlar`, [cekilenkisi.id])
        }
      }
    }
  


   const cekilisid = args[0]
   if (!cekilisid) return message.reply('Bir çekiliş IDsi belirtmeniz gerek.')
   
   if (!db.has(`cekilisidsi_${cekilisid}`)) return message.reply('Doğru bir çekiliş IDsi belirtmeniz gerek.')
   
   client.channels.cache.get(db.fetch(`cekilisidsi_${cekilisid}.mesaj.kanal`)).messages.fetch(db.fetch(`cekilisidsi_${cekilisid}.mesaj.id`)).then(async msg => {
     
     if (!db.has(`cekilis_${msg.id}`)) return message.reply('Bu çekiliş zaten bitmiş.')
     
  message.delete()
  const reaction = msg.reactions.cache.first()
  
  reaction.users.fetch().then(async kisiler => {
  const kazanansayisi = db.fetch(`cekilis_${msg.id}.kazanacak`)
  const verilecek = db.fetch(`cekilis_${msg.id}.verilecek`)
  const bitecegizamanms = db.fetch(`cekilis_${msg.id}.bitecek`)
  const asilkisisayisi = reaction.users.cache.size - 1
  if (asilkisisayisi < kazanansayisi) {
      let embed = new Discord.MessageEmbed()
      .setAuthor('🎉 Çekiliş Bitti 🎉')
      .setTitle('**' + verilecek + '**')
      .setDescription(`Yeterli katılım olmadığından kazanan seçilemedi.`)
      .setFooter(`${kazanansayisi} Kazanan | Çekiliş Başlatıldı | Çekiliş ID: ${cekilisid} | Bitti:`)
      .setTimestamp(Date.now())
      .setColor("#2F3136")
      msg.edit(embed)
      db.delete(`cekilis_${msg.id}`)
      let thall = db.all().filter(i => i.ID.includes(msg.id))
      for (const uu of thall) {
        db.delete(uu.ID)
      }
  }else{
  var array = reaction.users.cache.array()
  var u;
  for (u = 0; u < kazanansayisi; u++) {
     cekme(msg, array)
  }
await sleep(100)
let kazananherkes = db.fetch(`cekilis_${msg.id}.kazananlar`)
  let embed = new Discord.MessageEmbed()
  .setAuthor('🎉 Çekiliş Bitti 🎉')
  .setTitle('**' + verilecek + '**')
  .setDescription(`**Kazananlar:** <@${kazananherkes.join('>, <@')}>`)
  .setFooter(`${kazanansayisi} kazanan | ID: ${cekilisid} | Bitti:`)
  .setTimestamp(Date.now())
  .setColor("#2F3136")
  msg.edit(embed)
  msg.channel.send(`**Tebrikler** <@${kazananherkes.join('>, <@')}>! **\`${verilecek}\` çekilişini kazandınız!**`)
  db.set(`cekilisidsi_${cekilisid}.kazananlar`, kazananherkes)
  db.delete(`cekilis_${msg.id}`)
  let theall = db.all().filter(i => i.ID.includes(msg.id))
  for (const ua of theall) {
      db.delete(ua.ID)
  }
  }
})
    })
   
 
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'çekilişbitir',
  description: 'Bot adminlerinin bot üzerinde kod test etmesini sağlar.',
  usage: 'eval <kod>'
};